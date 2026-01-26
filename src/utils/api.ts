import axios from "axios";
import type {
  Articles,
  LoginData,
  LoginResponse,
  SearchFilter,
  SessionData,
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

// async function getItemPrice({
//   cardCode,
//   itemCode,
// }: GetItemPriceProps): Promise<ItemPriceResponse | null> {
//   try {
//     const response = await axios.post(
//       `CompanyService_GetItemPrice`,
//       {
//         ItemPriceParams: {
//           CardCode: cardCode,
//           ItemCode: itemCode,
//         },
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//         },
//         withCredentials: true,
//       },
//     );

//     const data: ItemPriceResponse = response.data;
//     return data;
//   } catch (error) {
//     console.error(`Error fetching price for item ${itemCode}:`, error);
//     return null;
//   }
// }

// async function getPricesForArticles({
//   cardCode,
//   itemCodes,
// }: FetchPricesForArticlesProps): Promise<PricesMap> {
//   const pricesMap = new Map<string, ItemPriceResponse>();

//   try {
//     // Fetch prices in parallel for all items
//     const pricePromises = itemCodes.map((itemCode) =>
//       getItemPrice({ cardCode, itemCode })
//         .then((price) => {
//           if (price !== null) {
//             pricesMap.set(itemCode, price);
//           }
//         })
//         .catch((error) => {
//           console.error(`Error fetching price for ${itemCode}:`, error);
//         }),
//     );

//     await Promise.all(pricePromises);
//   } catch (error) {
//     console.error("Error fetching prices for articles:", error);
//   }

//   return pricesMap;
// }

interface PostingPeriod {
  AbsoluteEntry: number;
  PeriodCode: string;
  PeriodName: string;
  FromDate: string;
  ToDate: string;
  PeriodStatus: string; // 'O' for open, 'C' for closed
}

async function getOpenPostingPeriod(): Promise<string | null> {
  try {
    const response = await axios.get(`PostingPeriods`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      withCredentials: true,
    });

    const periods: PostingPeriod[] = response.data.value;
    const openPeriod = periods.find((p) => p.PeriodStatus === "O");
    if (openPeriod) {
      // Return the FromDate as the date to use
      return openPeriod.FromDate.split("T")[0]; // Assuming it's in ISO format
    }
    return null;
  } catch (error) {
    console.error("Error fetching posting periods:", error);
    return null;
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
    await axios.post(
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
    toast.success("Purchase request created successfully!");
  } catch (error) {
    console.error("Error creating purchase request:", error);
    toast.error("Failed to create purchase request");
    throw error; // Re-throw to handle in component
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
        ? encodeURIComponent(`ItemCode eq '${searchText}'`)
        : encodeURIComponent(`ItemName eq '${searchText}'`);

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
  // getItemPrice,
  // getPricesForArticles,
  createPurchaseRequest,
  getOpenPostingPeriod,
};
