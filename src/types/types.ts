interface SessionData {
  SessionId: string | null;
  SessionTimeout: number | null;
  SessionCreatedAt: number | null;
}

interface LoginData {
  CompanyDB: string;
  UserName: string;
  Password: string;
}

type SuccessLoginResponse = {
  "@odata.context": string;
  Version: string;
} & SessionData;

type FailLoginResponse = {
  error: {
    code: string | null;
    details: {
      code: string | null;
      message: string | null;
    }[];
    message: string | null;
  };
};

type LoginResponse = SuccessLoginResponse | FailLoginResponse;

interface Article {
  ItemCode: string | null;
  ItemName: string | null;
  Price?: number | null;
  Currency?: string | null;
  Discount?: number | null;
}

type Articles = Article[];

type SearchFilter = "ItemCode" | "ItemName";

interface PurchaseRequest {
  DocEntry: number;
  DocNum: number;
  DocDate: string;
  RequriedDate: string;
  DocumentStatus: "bost_Open" | "bost_Closed" | "bost_Cancelled" | "bost_Draft";
  DocTotal?: number;
  DocumentLines?: {
    ItemCode: string;
    ItemName: string;
    Quantity: number;
    Price: number;
    LineTotal: number;
  }[];
}

type PurchaseRequests = PurchaseRequest[];

export type {
  SessionData,
  LoginData,
  LoginResponse,
  Article,
  Articles,
  SearchFilter,
  PurchaseRequest,
  PurchaseRequests,
};
