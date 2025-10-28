import { Navigate, useLocation, Outlet } from "react-router";
import { AuthUserI } from "../../interfaces/AuthInterfaces";

export default function AuthLayout({
  authUser,
}: {
  authUser: AuthUserI | null;
}) {
  const location = useLocation();
  return authUser ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
  // return <Outlet />;
}
