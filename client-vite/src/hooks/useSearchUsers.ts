import { useQuery } from "@tanstack/react-query";
import { api } from "../api/api";
import { UserI } from "../interfaces/UsersInterfaces";
import { AxiosError } from "axios";
import { ErrorResponse } from "../interfaces/ErrorResponseInterfaces";

export default function useSearchUsers(searchTerm: string) {
  const { data, isLoading, error } = useQuery({
    enabled: !!searchTerm,
    queryKey: ["searchConversations", searchTerm],
    queryFn: async () => {
      const response = await api.get<UserI[]>(
        `/users/search?searchTerm=${searchTerm}`
      );
      return response.data;
    },
    retry: 0,
  });

  return { data, isLoading, error: error as AxiosError<ErrorResponse> };
}
