"use client";
import { api } from "../api/api";
import { UserI } from "../interfaces/UsersInterfaces";
import { useQuery } from "@tanstack/react-query";

export const useGetUserById = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["userById", id],
    queryFn: async () => {
      const response = await api.get<UserI>(`/users/${id}`);
      return response.data;
    },
  });

  return { data, isLoading, error };
};
