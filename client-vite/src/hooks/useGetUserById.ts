import { api } from "../api/api";
import { UserI } from "../interfaces/UsersInterfaces";
import { useQuery } from "@tanstack/react-query";

export const useGetUserById = (id: string) => {
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["userById", id],
    queryFn: async () => {
      const response = await api.get<UserI>(`/users/user/${id}`);
      return response.data;
    },
  });

  return { data, isLoading, error, isFetching };
};
