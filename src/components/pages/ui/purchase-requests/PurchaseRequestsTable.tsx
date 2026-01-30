import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useEffect, useRef, useState } from "react";
import { fetchPurchaseRequests } from "@/utils/api";
import type { PurchaseRequests } from "@/types/types";
import PurchaseRequestsTableSkeleton from "./PurchaseRequestsTableSkeleton";

interface Props {
  isLoggedIn: boolean;
}

export function PurchaseRequestsTable({ isLoggedIn }: Props) {
  const [data, setData] = useState<PurchaseRequests>([]);
  const [loading, setLoading] = useState(true);
  const initializedRef = useRef(false);

  useEffect(() => {
    // Only fetch once and only if user is logged in
    if (initializedRef.current || !isLoggedIn) return;
    initializedRef.current = true;

    fetchPurchaseRequests({
      setLoading,
      setPurchaseRequests: setData,
    });
  }, [isLoggedIn]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "bost_Open":
        return "text-blue-600 bg-blue-50";
      case "bost_Closed":
        return "text-green-600 bg-green-50";
      case "bost_Cancelled":
        return "text-red-600 bg-red-50";
      case "bost_Draft":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  if (loading) {
    return <PurchaseRequestsTableSkeleton />;
  }

  return (
    <div className="space-y-4 rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Doc Num</TableHead>
            <TableHead>Doc Date</TableHead>
            <TableHead>Required Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Items</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="py-4 text-center text-gray-500">
                No purchase requests found
              </TableCell>
            </TableRow>
          ) : (
            data.map((pr) => {
              const total =
                pr.DocTotal ||
                pr.DocumentLines?.reduce(
                  (sum, line) => sum + (line.LineTotal || 0),
                  0,
                ) ||
                0;
              return (
                <TableRow key={pr.DocEntry}>
                  <TableCell>{pr.DocNum}</TableCell>
                  <TableCell>
                    {new Date(pr.DocDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(pr.RequriedDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`rounded px-2 py-1 text-sm font-medium ${getStatusColor(pr.DocumentStatus)}`}
                    >
                      {pr.DocumentStatus.replace("bost_", "")}
                    </span>
                  </TableCell>
                  <TableCell>{total.toFixed(2)}</TableCell>
                  <TableCell>
                    {pr.DocumentLines?.map((line) => (
                      <div key={line.ItemCode} className="text-sm">
                        {line.ItemCode} ({line.Quantity})
                      </div>
                    ))}
                  </TableCell>
                </TableRow>
              );
            })
          )}

          {data.length > 0 && (
            <TableRow className="flex items-center justify-center">
              <TableCell className="text-muted-foreground text-sm" colSpan={6}>
                Total: {data.length} purchase request
                {data.length !== 1 ? "s" : ""}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
