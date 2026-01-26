import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { Articles, SessionData } from "@/types/types";
import { fetchArticles, logout } from "@/utils/api";
import { ArticlesTable } from "@/components/pages/ui/article/ArticlesTable";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Spinner } from "../ui/spinner";

interface HomePageProps {
  isLoggedIn: boolean;
  setSessionData: (data: SessionData) => void;
}

function HomePage({ isLoggedIn, setSessionData }: HomePageProps) {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Articles>([]);
  const [allArticles, setAllArticles] = useState<Articles>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [hasMorePages, setHasMorePages] = useState<boolean>(true);
  const [logoutLoading, setLogoutLoading] = useState<boolean>(false);

  const cachedPagesRef = useRef<Map<number, Articles>>(new Map());
  const initializedRef = useRef(false);

  const pageSize = 20;

  function handleLogout() {
    logout({ setLoading: setLogoutLoading, setSessionData });
  }

  const handleFetchArticles = useCallback(
    (page: number) => {
      // Check if page is already cached
      if (cachedPagesRef.current.has(page)) {
        const cachedArticles = cachedPagesRef.current.get(page) || [];
        setPageIndex(page);
        setArticles(cachedArticles);
        // Update hasMorePages based on cached data
        setHasMorePages(cachedArticles.length === pageSize);
        setAllArticles(Array.from(cachedPagesRef.current.values()).flat());
        return;
      }

      setPageIndex(page);
      const skip = page * pageSize;
      fetchArticles({
        loading: false,
        setLoading,
        setArticles: (newArticles) => {
          setArticles(newArticles);
          cachedPagesRef.current.set(page, newArticles);
          // If returned articles are less than page size, we've reached the end
          setHasMorePages(newArticles.length === pageSize);
          setAllArticles(Array.from(cachedPagesRef.current.values()).flat());
        },
        skip,
        top: pageSize,
      });
    },
    [pageSize],
  );

  useEffect(() => {
    // Check if user is logged in
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    // Only initialize once
    if (initializedRef.current) return;
    initializedRef.current = true;

    const loadInitialData = () => {
      fetchArticles({
        loading: false,
        setLoading,
        setArticles: (newArticles) => {
          setArticles(newArticles);
          cachedPagesRef.current.set(0, newArticles);
          setHasMorePages(newArticles.length === pageSize);
          setAllArticles(Array.from(cachedPagesRef.current.values()).flat());
        },
        skip: 0,
        top: pageSize,
      });
    };

    loadInitialData();
  }, [isLoggedIn, navigate]);

  // Check if user is logged in
  if (!isLoggedIn) {
    navigate("/login");
    return;
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center justify-between bg-white px-2 pt-8 pb-4">
        <h1 className="text-2xl font-bold">Demande d'achats</h1>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          {logoutLoading ? (
            <>
              Logging out
              <Spinner />
            </>
          ) : (
            <>
              <LogOut className="h-4 w-4" />
              Logout
            </>
          )}
        </Button>
      </div>
      <ArticlesTable
        data={articles}
        allArticles={allArticles}
        loading={loading}
        onPageChange={handleFetchArticles}
        currentPage={pageIndex}
        hasMorePages={hasMorePages}
      />
    </div>
  );
}

export default HomePage;
