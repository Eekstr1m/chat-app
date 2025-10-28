import AuthForm from "../../components/AuthForm/AuthForm";

export default function Signup() {
  return (
    <AuthForm
      type="Signup"
      fields={[
        "firstName",
        "lastName",
        "userName",
        "email",
        "password",
        "confirmPassword",
      ]}
    />
  );
}
