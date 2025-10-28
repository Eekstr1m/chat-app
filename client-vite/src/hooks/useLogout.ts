import { useAuthContext } from "../context/AuthContext";
import { api } from "../api/api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toaster } from "../components/ui/toaster";
import { useNavigate } from "react-router";

export const useLogout = () => {
  const navigate = useNavigate();
  const { setAuthUser } = useAuthContext();

  // This is a helper function to handle errors
  const onErrorHandler = (error: AxiosError<{ error: string }>) => {
    toaster.create({
      description: error.response?.data?.error || "An error occurred",
      type: "error",
    });
  };

  // This is a helper function to handle successful logout
  const onSuccessHandler = () => {
    localStorage.removeItem("authUser");
    localStorage.removeItem("searchTerm");
    setAuthUser(null);
    navigate("/login");
  };

  // This is a helper function to create a mutation with an endpoint
  const mutation = useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      const response = await api.post("/auth/logout");
      return response.data;
    },
    onError: onErrorHandler,
    onSuccess: onSuccessHandler,
  });

  const logout = () => {
    mutation.mutate();
    localStorage.removeItem("authUser");
    setAuthUser(null);
    navigate("/login");
  };

  return { logout, isLoading: mutation.isPending, error: mutation.error };
};
