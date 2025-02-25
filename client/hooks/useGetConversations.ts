"use client";
import { api } from "../api/api";
import { UserI } from "../interfaces/UsersInterfaces";
import { useQuery } from "@tanstack/react-query";

export const useGetConversations = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const response = await api.get<UserI[]>("/users");
      return response.data;
    },
  });

  return { data, isLoading, error };
};
