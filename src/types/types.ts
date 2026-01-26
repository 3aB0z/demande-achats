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

export type {
  SessionData,
  LoginData,
  LoginResponse,
  Article,
  Articles,
  SearchFilter,
};
