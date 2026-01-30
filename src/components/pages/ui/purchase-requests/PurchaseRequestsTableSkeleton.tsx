import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

function PurchaseRequestsTableSkeleton() {
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
          {[...Array(10)].map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-3 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-3 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-3 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-14 rounded-sm" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-3 w-20" />
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default PurchaseRequestsTableSkeleton;
