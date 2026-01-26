import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

function ArticlesTableSkeleton() {
  return (
    <div className="h-fit rounded-sm border">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>
              <Skeleton className="size-5 rounded" />
            </TableHead>
            <TableHead>Item Code</TableHead>
            <TableHead>Item Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(13)].map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="size-5 rounded" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-36" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-36" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
export default ArticlesTableSkeleton;
