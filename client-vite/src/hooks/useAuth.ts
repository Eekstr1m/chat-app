import { toaster } from "../components/ui/toaster";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  AuthUserI,
  LoginDataI,
  SignupDataI,
} from "../interfaces/AuthInterfaces";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { api } from "../api/api";
export const useAuth = () => {
  const navigate = useNavigate();
  const { setAuthUser } = useAuthContext();

  // This is a helper function to handle errors
  const onErrorHandler = (error: AxiosError<{ error: string }>) => {
    toaster.create({
      description: error.response?.data?.error || "An error occurred",
      type: "error",
    });
  };

  // This is a helper function to handle successful login
  const onSuccessHandler = (data: AuthUserI) => {
    localStorage.setItem("authUser", JSON.stringify(data));
    setAuthUser(data);
    navigate("/messages");
  };

  // This is a helper function to create a mutation with an endpoint
  const useMutationWithEndpoint = (endpoint: string) =>
    useMutation({
      mutationKey: [endpoint],
      mutationFn: async (data: LoginDataI | SignupDataI) => {
        const response = await api.post<AuthUserI>(`/auth/${endpoint}`, data);
        return response.data;
      },
      onError: onErrorHandler,
      onSuccess: onSuccessHandler,
    });

  const login = useMutationWithEndpoint("login");
  const signup = useMutationWithEndpoint("signup");

  return {
    login,
    signup,
    isLoading: login.isPending || signup.isPending,
    error: login.error || signup.error,
  };
};
