import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { LoginData, SessionData } from "../../types/types";
import LoginForm from "./ui/LoginForm";
import { login } from "../../utils/api";

interface LoginPageProps {
  isLoggedIn: boolean;
  setSessionData: (data: SessionData) => void;
}

function LoginPage({ isLoggedIn, setSessionData }: LoginPageProps) {
  const navigate = useNavigate();
  const [formFields, setFormFields] = useState<LoginData>({
    CompanyDB: "",
    UserName: "",
    Password: "",
  });

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  async function handleLogin(): Promise<void> {
    const loginData: LoginData = { ...formFields };
    login({ setLoading, loginData, setSessionData });
  }

  // Check if user is logged in
  if (isLoggedIn) {
    navigate("/");
    return;
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-md flex-col items-center space-y-8 rounded-lg border p-8 shadow-lg">
        <h1 className="text-3xl font-bold">Login</h1>
        <LoginForm
          loading={loading}
          formFields={formFields}
          handleInputChange={(name, value) =>
            setFormFields((prev) => ({ ...prev, [name]: value }))
          }
          handleSubmit={() => handleLogin()}
        />
      </div>
    </div>
  );
}

export default LoginPage;
