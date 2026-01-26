import type { LoginData } from "@/types/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface LoginFormProps {
  loading: boolean;
  formFields: LoginData;
  handleInputChange: (name: string, value: string) => void;
  handleSubmit: () => void;
}

function LoginForm({
  loading,
  formFields,
  handleInputChange,
  handleSubmit,
}: LoginFormProps) {
  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="flex w-full flex-col items-start gap-6"
      >
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="CompanyDB">CompanyDB</Label>
          <Input
            type="Text"
            name="CompanyDB"
            placeholder="Enter CompanyDB"
            value={formFields.CompanyDB}
            onChange={(e) => handleInputChange(e.target.name, e.target.value)}
            required
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="UserName">UserName</Label>
          <Input
            type="Text"
            name="UserName"
            placeholder="Enter UserName"
            value={formFields.UserName}
            onChange={(e) => handleInputChange(e.target.name, e.target.value)}
            required
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="Password">Password</Label>
          <Input
            type="Password"
            name="Password"
            placeholder="Enter Password"
            value={formFields.Password}
            onChange={(e) => handleInputChange(e.target.name, e.target.value)}
            required
          />
        </div>
        <Button
          type="submit"
          className="bg-primary-500 hover:bg-primary-600 w-full"
        >
          {loading ? <Spinner /> : "Submit"}
        </Button>
      </form>
    </>
  );
}

export default LoginForm;
