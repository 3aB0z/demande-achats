import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PurchaseRequestsTable } from "./ui/purchase-requests/PurchaseRequestsTable";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface PurchaseRequestsPageProps {
  isLoggedIn: boolean;
}

export default function PurchaseRequestsPage({
  isLoggedIn,
}: PurchaseRequestsPageProps) {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
  }, [isLoggedIn, navigate]);

  // Check if user is logged in
  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex flex-col items-start gap-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Articles
        </Button>
        <h1 className="text-2xl font-bold">My Purchase Requests</h1>
      </div>
      <PurchaseRequestsTable isLoggedIn={isLoggedIn} />
    </div>
  );
}
