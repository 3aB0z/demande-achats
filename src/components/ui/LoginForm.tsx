import {
  BusyIndicator,
  Button,
  Form,
  FormGroup,
  FormItem,
  Input,
  Label,
} from "@ui5/webcomponents-react";
import type { LoginData } from "../../types/types";

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
      <Form headerText="Welcome">
        <FormGroup headerText="Informations">
          <FormItem labelContent={<Label for="CompanyDB">CompanyDB:</Label>}>
            <Input
              type="Text"
              name="CompanyDB"
              placeholder="Enter CompanyDB"
              value={formFields.CompanyDB}
              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
              required
            />
          </FormItem>
          <FormItem labelContent={<Label for="UserName">UserName:</Label>}>
            <Input
              type="Text"
              name="UserName"
              placeholder="Enter UserName"
              value={formFields.UserName}
              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
              required
            />
          </FormItem>
          <FormItem labelContent={<Label for="Password">Password:</Label>}>
            <Input
              type="Password"
              name="Password"
              placeholder="Enter Password"
              value={formFields.Password}
              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
              required
            />
          </FormItem>
          <FormItem>
            <Button
              type="Submit"
              design="Emphasized"
              onClick={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              {loading ? <BusyIndicator /> : "Submit"}
            </Button>
          </FormItem>
        </FormGroup>
      </Form>
    </>
  );
}

export default LoginForm;
