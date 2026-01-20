import { useEffect, useState } from "react";
import type { LoginData, SessionData } from "../../types/types";
import LoginForm from "../ui/LoginForm";
import { useNavigate } from "react-router-dom";
import { login } from "../../utils/api";

interface LoginPageProps {
  isLoggedIn: boolean;
  setSessionData: (data: SessionData) => void;
}

function LoginPage({ isLoggedIn, setSessionData }: LoginPageProps) {
  const [formFields, setFormFields] = useState<LoginData>({
    CompanyDB: "",
    UserName: "",
    Password: "",
  });

  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    console.log(isLoggedIn);
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  async function handleLogin(): Promise<void> {
    const loginData: LoginData = { ...formFields };
    login({ setLoading, loginData, setSessionData });
  }

  return (
    <>
      <LoginForm
        loading={loading}
        formFields={formFields}
        handleInputChange={(name, value) =>
          setFormFields((prev) => ({ ...prev, [name]: value }))
        }
        handleSubmit={() => handleLogin()}
      />
    </>
  );
}

export default LoginPage;
