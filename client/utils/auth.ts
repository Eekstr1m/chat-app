import { AuthUserI } from "../interfaces/AuthInterfaces";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const handleAuthRedirect = (
  authUser: AuthUserI | null,
  router: AppRouterInstance
) => {
  if (!authUser) {
    router.push("/login");
  } else if (authUser) {
    router.push("/messages");
  }
};
