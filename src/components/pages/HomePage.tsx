import {
  Table,
  TableRow,
  TableCell,
  TableHeaderRow,
  TableHeaderCell,
  Button,
} from "@ui5/webcomponents-react";
import { useEffect, useState } from "react";
import type { Articles } from "../../types/types";
import { fetchArticles } from "../../utils/api";

function HomePage() {
  const [articles, setArticles] = useState<Articles>([]);

  const [loading, setLoading] = useState<boolean>(false);

  function handleRefreshArticles() {
    if (loading) return;
    fetchArticles({
      loading,
      setLoading,
      setArticles,
    });
  }

  useEffect(() => {
    if (loading) return;
    fetchArticles({
      loading,
      setLoading,
      setArticles,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-start gap-6 px-2">
      <h2 className="mt-2 text-2xl font-bold">Available articles</h2>
      <Table
        headerRow={
          <TableHeaderRow sticky>
            <TableHeaderCell minWidth="200px" width="200px">
              <span>ItemCode</span>
            </TableHeaderCell>
            <TableHeaderCell minWidth="200px">
              <span>ItemName</span>
            </TableHeaderCell>
            <TableHeaderCell minWidth="200px">
              <span>InStock</span>
            </TableHeaderCell>
            <TableHeaderCell minWidth="200px">
              <Button
                type="Button"
                icon="sap-icon://refresh"
                onClick={handleRefreshArticles}
                disabled={loading}
              />
            </TableHeaderCell>
          </TableHeaderRow>
        }
        onRowActionClick={function qK() {}}
        onRowClick={function qK() {}}
        loading={loading}
      >
        {articles.map((article, index) => {
          return (
            <TableRow rowKey={String(index)}>
              <TableCell>
                <span>{article.ItemCode}</span>
              </TableCell>
              <TableCell>
                <span>{article.ItemName}</span>
              </TableCell>
              <TableCell>
                <span>{article.InStock}</span>
              </TableCell>
            </TableRow>
          );
        })}
      </Table>
    </div>
  );
}

export default HomePage;
