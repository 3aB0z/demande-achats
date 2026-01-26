import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { useEffect, useState } from "react";
import ArticlesTableSkeleton from "./ArticlesTableSkeleton";
import {
  createPurchaseRequest,
  getOpenPostingPeriod,
  searchArticles,
} from "@/utils/api";
import { Spinner } from "@/components/ui/spinner";
import type { Article, SearchFilter } from "@/types/types";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  data: Article[];
  allArticles?: Article[];
  loading: boolean;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  hasMorePages?: boolean;
}

export function ArticlesTable({
  data,
  allArticles = [],
  loading,
  onPageChange,
  currentPage = 0,
  hasMorePages = true,
}: Props) {
  const [search, setSearch] = useState("");
  const [searchFilter, setSearchFilter] = useState<SearchFilter>("ItemCode");
  const [filteredData, setFilteredData] = useState<Article[]>(data);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [quantities, setQuantities] = useState<Map<string, number>>(new Map());
  const [creatingRequest, setCreatingRequest] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Compute selectAll state based on current page's data
  const allPageItemCodes = filteredData
    .map((article) => article.ItemCode)
    .filter((code): code is string => code !== null);

  const selectAll =
    allPageItemCodes.length > 0 &&
    allPageItemCodes.every((code) => selectedRows.has(code));

  const handleSearch = (value: string) => {
    setSearch(value);

    if (!value.trim()) {
      // If search is empty, show current page data
      setFilteredData(data);
      setSelectedRows(new Set());
      return;
    }

    // Call API to search for articles
    searchArticles({
      searchText: value,
      searchFilter,
      setLoading: setIsSearching,
      setArticles: (results) => {
        setFilteredData(results);
        // Reset selection when searching
        setSelectedRows(new Set());
      },
    });
  };

  const handleNextPage = () => {
    if (onPageChange) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (onPageChange && currentPage > 0) {
      onPageChange(currentPage - 1);
    }
  };

  const handleSelectRow = (itemCode: string | null) => {
    if (!itemCode) return;
    const newSelected = new Set(selectedRows);
    if (newSelected.has(itemCode)) {
      newSelected.delete(itemCode);
    } else {
      newSelected.add(itemCode);
    }
    setSelectedRows(newSelected);

    // Ensure a default quantity of 1 is set when an item is selected,
    // and remove quantity when deselected so totals update immediately.
    setQuantities((prev) => {
      const m = new Map(prev);
      if (newSelected.has(itemCode)) {
        if (!m.has(itemCode)) m.set(itemCode, 1);
      } else {
        m.delete(itemCode);
      }
      return m;
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      // Deselect all items from this page
      const pageItemCodes = new Set(allPageItemCodes);
      const newSelected = new Set(selectedRows);
      pageItemCodes.forEach((code) => newSelected.delete(code));
      setSelectedRows(newSelected);
      // Remove quantities for deselected items
      setQuantities((prev) => {
        const m = new Map(prev);
        pageItemCodes.forEach((code) => m.delete(code));
        return m;
      });
    } else {
      // Select all items from this page
      const newSelected = new Set(selectedRows);
      allPageItemCodes.forEach((code) => newSelected.add(code));
      setSelectedRows(newSelected);
      // Ensure default quantity of 1 for newly selected items
      setQuantities((prev) => {
        const m = new Map(prev);
        allPageItemCodes.forEach((code) => {
          if (!m.has(code)) m.set(code, 1);
        });
        return m;
      });
    }
  };

  const handleCreatePurchaseRequest = async () => {
    setCreatingRequest(true);
    const openDate = await getOpenPostingPeriod();
    const docDate = openDate || "2025-01-01"; // Fallback if no open period
    const documentLines = Array.from(selectedRows).map((itemCode) => ({
      ItemCode: itemCode,
      Quantity: quantities.get(itemCode) || 1,
    }));

    try {
      await createPurchaseRequest({
        DocDate: docDate,
        RequriedDate: docDate,
        DocumentLines: documentLines,
      });
      // On success, clear selections
      setSelectedRows(new Set());
      setQuantities(new Map());
    } catch {
      // Error handled in api
    } finally {
      setCreatingRequest(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      setFilteredData(data);
      // Only reset search when page changes, keep selections
      setSearch("");
    });
  }, [data]);

  return (
    <div className="flex h-full w-full flex-col items-start gap-4 overflow-y-hidden p-2">
      {/* Navigation and Search */}
      <div className="flex w-full items-center justify-between gap-4">
        <ButtonGroup aria-label="Search Filter" className="flex-1">
          <Select
            value={searchFilter}
            onValueChange={(value: SearchFilter) => setSearchFilter(value)}
          >
            <SelectTrigger>
              <SelectValue>{searchFilter}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="ItemCode">ItemCode</SelectItem>
                <SelectItem value="ItemName">ItemName</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Input
            placeholder={`Search by ${searchFilter}...`}
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1"
          />
        </ButtonGroup>
        {/* <div className="flex items-center gap-2">
          <div>Search by:</div>
          <ButtonGroup aria-label="Search Filter">
            <Button variant="outline">ItemCode</Button>
            <Button variant="outline">ItemName</Button>
          </ButtonGroup>
        </div> */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className={`pointer-events-auto hover:${currentPage === 0 || loading ? "cursor-not-allowed" : "cursor-auto"}`}
            onClick={handlePreviousPage}
            disabled={currentPage === 0 || loading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-nowrap hover:cursor-default">
            Page {currentPage + 1}
          </span>
          <Button
            variant="outline"
            size="icon"
            className={`pointer-events-auto hover:${!hasMorePages || loading ? "cursor-not-allowed" : "cursor-auto"}`}
            onClick={handleNextPage}
            disabled={!hasMorePages || loading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Table and Selected Rows */}
      <div className="flex h-full w-full gap-4 overflow-y-auto pr-2">
        {/* Table */}
        <div className="h-full min-w-0 flex-1">
          {loading || isSearching ? (
            <ArticlesTableSkeleton />
          ) : (
            <div className="rounded-sm border">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8">
                      <Checkbox
                        checked={selectAll}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="flex-1">Item Code</TableHead>
                    <TableHead className="flex-1">Item Name</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length > 0 ? (
                    filteredData.map((article) => (
                      <TableRow key={article.ItemCode}>
                        <TableCell className="w-8">
                          <Checkbox
                            checked={selectedRows.has(article.ItemCode || "")}
                            onCheckedChange={() =>
                              handleSelectRow(article.ItemCode)
                            }
                          />
                        </TableCell>
                        <TableCell className="flex-1 truncate">
                          {article.ItemCode ?? "—"}
                        </TableCell>
                        <TableCell className="flex-1 truncate">
                          {article.ItemName ?? "—"}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">
                        No results
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Selected Rows Panel - Right Side Sidebar */}
        <div className="sticky top-0 flex h-full w-80 shrink-0 flex-col gap-3 rounded-lg border bg-white px-4 pt-3 pb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-800">
              Selected
              <span className="ml-2 rounded border border-slate-100 bg-slate-50 px-1 py-0.5 text-sm text-slate-600">
                {selectedRows.size}
              </span>
            </h3>
            <Button
              variant="destructive"
              size="sm"
              className="h-7 text-xs"
              onClick={() => {
                setSelectedRows(new Set());
                setQuantities(new Map());
              }}
              disabled={selectedRows.size === 0}
            >
              Remove All
            </Button>
          </div>
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
            {Array.from(selectedRows).map((itemCode) => {
              return (
                <div
                  key={itemCode}
                  className="flex flex-col gap-2 rounded-md border border-slate-200 bg-slate-50 p-3 transition-colors hover:bg-slate-100"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">
                        {itemCode}
                      </div>
                      <div className="truncate text-xs text-gray-600">
                        {allArticles.find((a) => a.ItemCode === itemCode)
                          ?.ItemName ?? "—"}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0"
                      onClick={() => {
                        const newSelected = new Set(selectedRows);
                        newSelected.delete(itemCode);
                        setSelectedRows(newSelected);
                        const newQuantities = new Map(quantities);
                        newQuantities.delete(itemCode);
                        setQuantities(newQuantities);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-medium whitespace-nowrap text-gray-600">
                      Qty:
                    </label>
                    <Input
                      type="number"
                      min="1"
                      value={quantities.get(itemCode) || ""}
                      onChange={(e) => {
                        let value = e.target.value
                          ? parseInt(e.target.value, 10)
                          : 0;
                        if (value < 1) {
                          value = 1;
                        }
                        const newQuantities = new Map(quantities);
                        newQuantities.set(itemCode, value);
                        setQuantities(newQuantities);
                      }}
                      step={1}
                      className="h-7 flex-1 bg-white text-xs"
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex flex-col gap-2 border-t pt-3">
            <Button
              onClick={handleCreatePurchaseRequest}
              disabled={selectedRows.size === 0 || creatingRequest}
              className="w-full"
            >
              {creatingRequest ? (
                <div className="flex items-center justify-center gap-2">
                  <span>Creating...</span>
                  <Spinner />
                </div>
              ) : (
                "Create Purchase Request"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
