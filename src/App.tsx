import { Route, Routes, useNavigate } from "react-router-dom";
import HomePage from "./components/pages/HomePage";
import Layout from "./components/layouts/Layout";
import { useEffect, useState, useCallback } from "react";
import LoginPage from "./components/pages/LoginPage";
// import { BusyIndicator } from "@ui5/webcomponents-react";
import type { SessionData } from "./types/types";
import "./utils/axios";

function App() {
  const [sessionData, setSessionData] = useState<SessionData>(
    (): SessionData => {
      const SessionId = localStorage.getItem("SessionId");
      const SessionTimeout = localStorage.getItem("SessionTimeout");
      const SessionCreatedAt = localStorage.getItem("SessionCreatedAt");
      return {
        SessionId: SessionId || null,
        SessionTimeout: SessionTimeout ? parseInt(SessionTimeout) : null,
        SessionCreatedAt: SessionCreatedAt ? parseInt(SessionCreatedAt) : null,
      };
    },
  );
  // const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  const isSessionExpired = useCallback((): boolean => {
    if (!sessionData.SessionCreatedAt || !sessionData.SessionTimeout) {
      return true;
    }
    const currentTime = Date.now();
    const sessionAgeInMinutes =
      (currentTime - sessionData.SessionCreatedAt) / (1000 * 60);
    return sessionAgeInMinutes > sessionData.SessionTimeout;
  }, [sessionData.SessionCreatedAt, sessionData.SessionTimeout]);

  const isLoggedIn: boolean =
    !isSessionExpired() && sessionData.SessionId ? true : false;

  function clearLocalStorage() {
    localStorage.removeItem("SessionId");
    localStorage.removeItem("SessionTimeout");
    localStorage.removeItem("SessionCreatedAt");
    console.log("Session expired. Logging out.");
  }

  useEffect(() => {
    if (isSessionExpired()) {
      clearLocalStorage();
      navigate("/login");
    }
  }, [isSessionExpired, navigate]);

  // Auto-logout timer when session timeout expires
  useEffect(() => {
    if (!sessionData.SessionCreatedAt || !sessionData.SessionTimeout) {
      return;
    }

    const timeRemaining =
      sessionData.SessionTimeout * 60 * 1000 -
      (Date.now() - sessionData.SessionCreatedAt);

    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        setSessionData({
          SessionId: null,
          SessionTimeout: null,
          SessionCreatedAt: null,
        });
        clearLocalStorage();
        navigate("/login");
      }, timeRemaining);

      return () => clearTimeout(timer);
    }
  }, [sessionData.SessionCreatedAt, sessionData.SessionTimeout, navigate]);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  // if (loading) {
  //   return <BusyIndicator size="L" />;
  // }
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route
            path="/login"
            element={
              <LoginPage
                isLoggedIn={isLoggedIn}
                setSessionData={(data) => setSessionData(data)}
              />
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
