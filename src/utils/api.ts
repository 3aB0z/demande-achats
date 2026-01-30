import axios from "axios";
import type {
  Articles,
  LoginData,
  LoginResponse,
  SearchFilter,
  SessionData,
  PurchaseRequests,
} from "@/types/types";
import { toast } from "sonner";

// interface GetItemPriceProps {
//   cardCode: string;
//   itemCode: string;
// }

// interface ItemPriceResponse {
//   Price: number;
//   Currency?: string;
//   Discount?: number;
// }

// interface FetchPricesForArticlesProps {
//   cardCode: string;
//   itemCodes: string[];
// }

// type PricesMap = Map<string, ItemPriceResponse>;

interface LoginProps {
  setLoading: (value: boolean) => void;
  loginData: LoginData;
  setSessionData: (value: SessionData) => void;
}

interface FetchArticlesProps {
  loading: boolean;
  setLoading: (value: boolean) => void;
  setArticles: (value: Articles) => void;
  setHasMorePages?: (value: boolean) => void;
  skip?: number;
  top?: number;
}

async function login({
  setLoading,
  loginData,
  setSessionData,
}: LoginProps): Promise<void> {
  setLoading(true);
  try {
    const loginResponse = await axios.post(`Login`, loginData, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      withCredentials: true,
    });
    const data: LoginResponse = loginResponse.data;
    if (
      loginResponse.status === 200 &&
      "SessionId" in data &&
      "SessionTimeout" in data
    ) {
      const { SessionId, SessionTimeout } = data;
      const SessionCreatedAt = Date.now();
      console.log(SessionId, SessionTimeout, SessionCreatedAt);
      localStorage.setItem("SessionId", String(SessionId));
      localStorage.setItem("SessionTimeout", String(SessionTimeout));
      localStorage.setItem("SessionCreatedAt", String(SessionCreatedAt));
      setSessionData({
        SessionId,
        SessionTimeout,
        SessionCreatedAt,
      });
      toast.success("Logged in successfully!");
    } else if (loginResponse.status !== 200 && "error" in data) {
      const { error } = data;
      toast.error("Login failed");
      throw new Error(error.message || "Login failed");
    }
  } catch (error) {
    console.error(error);
    toast.error("Login failed");
    throw error;
  } finally {
    setLoading(false);
  }
}

interface LogoutProps {
  setLoading: (value: boolean) => void;
  setSessionData: (value: SessionData) => void;
}

async function logout({
  setLoading,
  setSessionData,
}: LogoutProps): Promise<void> {
  setLoading(true);
  try {
    const logoutResponse = await axios.post(
      `Logout`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        withCredentials: true,
      },
    );

    if (logoutResponse.status !== 204) {
      return;
    }
    // Clear session state - this will trigger App.tsx to redirect to login
    setSessionData({
      SessionId: null,
      SessionTimeout: null,
      SessionCreatedAt: null,
    });
    // Clear local storage
    localStorage.removeItem("SessionId");
    localStorage.removeItem("SessionTimeout");
    localStorage.removeItem("SessionCreatedAt");
    toast.success("Logged out successfully!");
  } catch (error) {
    console.error("Error during logout:", error);
    toast.error("Logout failed");
  } finally {
    setLoading(false);
  }
}

async function fetchArticles({
  loading,
  setLoading,
  setArticles,
  setHasMorePages,
  skip = 0,
  top = 20,
}: FetchArticlesProps) {
  if (loading) return;
  setLoading(true);
  try {
    const res = await axios.get(
      `Items?$select=ItemCode,ItemName&$skip=${skip}&$top=${top}`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        withCredentials: true,
      },
    );

    const data = await res.data.value;

    setArticles(data);
    if (setHasMorePages) {
      setHasMorePages(data.length === top);
    }
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
}

interface CreatePurchaseRequestProps {
  DocDate: string;
  RequriedDate: string;
  DocumentLines: { ItemCode: string; Quantity: number }[];
}

async function createPurchaseRequest({
  DocDate,
  RequriedDate,
  DocumentLines,
}: CreatePurchaseRequestProps): Promise<void> {
  try {
    const res = await axios.post(
      `PurchaseRequests`,
      {
        DocDate,
        RequriedDate,
        DocumentLines,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        withCredentials: true,
      },
    );

    // Extract DocNum from response
    const docNum = res.data.DocNum;
    if (docNum) {
      // Store DocNum in localStorage
      const storedDocNums = JSON.parse(
        localStorage.getItem("MyPurchaseRequests") || "[]",
      );
      if (!storedDocNums.includes(docNum)) {
        storedDocNums.push(docNum);
        localStorage.setItem(
          "MyPurchaseRequests",
          JSON.stringify(storedDocNums),
        );
      }
    }

    toast.success("Purchase request created successfully!");
  } catch (error) {
    console.error("Error creating purchase request:", error);
    toast.error("Failed to create purchase request");
    throw error; // Re-throw to handle in component
  }
}

interface FetchPurchaseRequestsProps {
  setLoading: (value: boolean) => void;
  setPurchaseRequests: (value: PurchaseRequests) => void;
}

async function fetchPurchaseRequests({
  setLoading,
  setPurchaseRequests,
}: FetchPurchaseRequestsProps): Promise<void> {
  setLoading(true);
  try {
    // Get stored DocNums from localStorage
    const storedDocNums = JSON.parse(
      localStorage.getItem("MyPurchaseRequests") || "[]",
    ) as number[];

    if (storedDocNums.length === 0) {
      setPurchaseRequests([]);
      return;
    }

    // Fetch purchase requests by DocNum
    const docNumFilter = storedDocNums
      .map((num) => `DocNum eq ${num}`)
      .join(" or ");
    const res = await axios.get(
      `PurchaseRequests?$filter=${encodeURIComponent(docNumFilter)}&$orderby=DocEntry desc`,
      {
        headers: {
          Accept: "application/json",
        },
        withCredentials: true,
      },
    );

    const data = res.data.value || [];
    setPurchaseRequests(data);
  } catch (error) {
    console.error("Error fetching purchase requests:", error);
    toast.error("Failed to fetch purchase requests");
  } finally {
    setLoading(false);
  }
}

interface SearchArticlesProps {
  searchText: string;
  searchFilter: SearchFilter;
  setLoading: (value: boolean) => void;
  setArticles: (value: Articles) => void;
  skip?: number;
  top?: number;
}

async function searchArticles({
  searchText,
  searchFilter,
  setLoading,
  setArticles,
  skip = 0,
  top = 20,
}: SearchArticlesProps) {
  setLoading(true);
  try {
    // Create filter query to search for items by code or name
    const filter =
      searchFilter === "ItemCode"
        ? encodeURIComponent(`contains(ItemCode, '${searchText}')`)
        : encodeURIComponent(`contains(ItemName, '${searchText}')`);

    const res = await axios.get(
      `Items?$select=ItemCode,ItemName&$filter=${filter}&$skip=${skip}&$top=${top}`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        withCredentials: true,
      },
    );

    const data = await res.data.value;
    setArticles(data);
  } catch (error) {
    console.error("Error searching articles:", error);
    toast.error("Failed to search articles");
  } finally {
    setLoading(false);
  }
}

export {
  login,
  logout,
  fetchArticles,
  searchArticles,
  createPurchaseRequest,
  fetchPurchaseRequests,
};
