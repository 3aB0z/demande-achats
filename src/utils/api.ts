import axios from "axios";
import type {
  Article,
  Articles,
  LoginData,
  LoginResponse,
  SessionData,
} from "../types/types";

interface ArticleResponse {
  Items: {
    ItemCode: string | null;
    ItemName: string | null;
  };
  "Items/ItemWarehouseInfoCollection": {
    InStock: number;
  };
}

interface LoginProps {
  setLoading: (value: boolean) => void;
  loginData: LoginData;
  setSessionData: (value: SessionData) => void;
}

interface FetchArticlesProps {
  loading: boolean;
  setLoading: (value: boolean) => void;
  setArticles: (value: Articles) => void;
}

const token = localStorage.getItem("SessionId");

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
        Authorization: `Bearer ${token}`,
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
    } else if (loginResponse.status !== 200 && "error" in data) {
      const { error } = data;
      console.error(error.message);
      return;
    }
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
}

async function fetchArticles({
  loading,
  setLoading,
  setArticles,
}: FetchArticlesProps) {
  if (loading) return;
  setLoading(true);
  try {
    const res = await axios.get(
      "$crossjoin(Items,Items/ItemWarehouseInfoCollection)?$expand=Items($select=ItemCode,ItemName),Items/ItemWarehouseInfoCollection($select=InStock)&$filter=Items/ItemCode eq Items/ItemWarehouseInfoCollection/ItemCode and Items/ItemWarehouseInfoCollection/InStock gt 0",
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        withCredentials: true,
      },
    );

    const data: ArticleResponse[] = await res.data.value;
    const articles: Articles = data.map((item: ArticleResponse) => {
      const article: Article = {
        ItemCode: item.Items.ItemCode,
        ItemName: item.Items.ItemName,
        InStock: item["Items/ItemWarehouseInfoCollection"].InStock,
      };
      return article;
    });

    setArticles(articles);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
}

export { login, fetchArticles };
