import { api } from "../api/api";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { UserI } from "../interfaces/UsersInterfaces";
import { AxiosError } from "axios";
import { ErrorResponse } from "../interfaces/ErrorResponseInterfaces";
import { useAuthContext } from "../context/AuthContext";

export const useFollowConversation = () => {
  const queryClient = useQueryClient();
  const { setAuthUser } = useAuthContext();

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.put<UserI>(`/users/follow/${id}`);
      return response.data;
    },
    onSuccess: (data: UserI) => {
      queryClient.invalidateQueries({ queryKey: ["followConversation"] });
      localStorage.setItem("authUser", JSON.stringify(data));
      setAuthUser(data);
    },
  });

  return {
    followConversation: mutate,
    isLoading: isPending,
    error: error as AxiosError<ErrorResponse>,
  };
};
