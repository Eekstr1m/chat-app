import { api } from "../api/api";
import { toaster } from "../components/ui/toaster";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { MessageI } from "../interfaces/MessagesInterfaces";

export const useSendMessage = (receiverId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["sendMessage", receiverId],
    mutationFn: async ({
      message,
      contentType,
    }: {
      message: string;
      contentType: string;
    }) => {
      const response = await api.post<MessageI>(
        `/messages/send/${receiverId}`,
        { message, contentType }
      );
      return response.data;
    },
    onSuccess: (newMessage) => {
      // Update messages cache
      queryClient.setQueryData<MessageI[]>(
        ["messages", receiverId],
        (oldData) => {
          if (!oldData) return [newMessage];
          return [...oldData, newMessage];
        }
      );
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toaster.create({
        description: error.response?.data?.error || "An error occurred",
        type: "error",
      });
    },
  });

  return {
    sendMessage: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
  };
};
