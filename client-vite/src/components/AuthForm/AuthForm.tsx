import { Field } from "../../components/ui/field";
import { PasswordInput } from "../../components/ui/password-input";
import {
  Box,
  Button,
  Center,
  Container,
  Heading,
  Highlight,
  Input,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import {
  FieldErrors,
  SubmitHandler,
  useForm,
  UseFormRegister,
} from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import { FormInputsI } from "../../interfaces/AuthInterfaces";
import { Link } from "react-router";

export default function AuthForm({
  type,
  fields,
}: {
  type: "Login" | "Signup";
  fields: string[];
}) {
  return (
    <Container fluid>
      <Center height={type === "Login" ? "100vh" : ""}>
        <Box m={10} p={10} className="glassmorphism" minWidth={"320px"}>
          {/* Header */}
          <FormHeader type={type} />
          {/* Input block */}
          <FormInputBlock type={type} fields={fields} />
          {/* Link to login or sighup */}
          <FormFooter type={type} />
        </Box>
      </Center>
    </Container>
  );
}

function FormHeader({ type }: { type: "Login" | "Signup" }) {
  return (
    <Center>
      <Heading as={"h1"} fontSize={"2rem"} mb={"8"}>
        <Highlight
          query="Chat App"
          styles={{
            px: "0.5",
            color: "primary",
            fontStyle: "italic",
          }}
        >
          {`${type} Chat App`}
        </Highlight>
      </Heading>
    </Center>
  );
}

function FormFooter({ type }: { type: "Login" | "Signup" }) {
  return (
    <Box mt={4}>
      <Link to={type === "Login" ? "/signup" : "/login"}>
        <Highlight
          query={type === "Login" ? "Signup" : "Login"}
          styles={{
            fontStyle: "italic",
            textDecoration: "underline",
          }}
        >
          {type === "Login"
            ? `Don't have an account? Signup`
            : "Already have an account? Login"}
        </Highlight>
      </Link>
    </Box>
  );
}

function FormInputBlock({
  type,
  fields,
}: {
  type: "Login" | "Signup";
  fields: string[];
}) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormInputsI>();
  const { login, signup, isLoading } = useAuth();

  const onSubmit: SubmitHandler<FormInputsI> = (data) => {
    if (type === "Login") {
      const { userName, password } = data;
      login.mutate({ userName, password });
    } else {
      const { firstName, lastName, userName, email, password } = data;
      signup.mutate({ firstName, lastName, userName, email, password });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="10" width="full">
        {fields.map((field) => (
          <FormInput
            key={field}
            field={field as keyof FormInputsI}
            register={register}
            errors={errors}
          />
        ))}
        <Button
          disabled={isLoading}
          type="submit"
          bg={"primary"}
          color={"#f7f4f3"}
        >
          {isLoading ? <Spinner /> : "Submit"}
        </Button>
      </Stack>
    </form>
  );
}

function FormInput({
  field,
  register,
  errors,
}: {
  field: keyof FormInputsI;
  register: UseFormRegister<FormInputsI>;
  errors: FieldErrors<FormInputsI>;
}) {
  // Convert field name to label
  const label =
    field.charAt(0).toUpperCase() +
    field
      .slice(1)
      .replace(/([A-Z])/g, " $1")
      .trim();

  return (
    <Field
      label={label}
      required
      invalid={!!errors[field]}
      errorText={!!errors[field] && "This field is required"}
    >
      {field === "password" || field === "confirmPassword" ? (
        <PasswordInput
          {...register(field, { required: true })}
          placeholder="********"
        />
      ) : (
        <Input
          {...register(field, { required: true })}
          placeholder={`Enter your ${label}`}
        />
      )}
    </Field>
  );
}
