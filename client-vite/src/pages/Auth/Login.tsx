import AuthForm from "../../components/AuthForm/AuthForm";

export default function Login() {
  return <AuthForm type="Login" fields={["userName", "password"]} />;
}
