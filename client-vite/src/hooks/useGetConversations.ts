import { api } from "../api/api";
import { UserI } from "../interfaces/UsersInterfaces";
import { useQuery } from "@tanstack/react-query";

export const useGetConversations = () => {
  const { data, isLoading, error, refetch } = useQuery<UserI[]>({
    queryKey: ["conversations"],
    queryFn: async () => {
      const response = await api.get("/users/followed");
      return response.data;
    },
  });

  return { data, isLoading, error, refetch };
};
