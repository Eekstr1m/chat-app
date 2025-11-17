import { api } from "../api/api";
import { toaster } from "../components/ui/toaster";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  MessageI,
  PaginatedMessagesResponse,
} from "../interfaces/MessagesInterfaces";

export const useSendMessage = (receiverId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["sendMessage", receiverId],
    mutationFn: async ({
      message,
      contentType,
      repliedTo,
    }: {
      message: string;
      contentType: string;
      repliedTo?: string;
    }) => {
      const response = await api.post<MessageI>(
        `/messages/send/${receiverId}`,
        { message, contentType, repliedTo }
      );
      return response.data;
    },
    onSuccess: (newMessage) => {
      // Update messages cache.
      // The `messages` query stores a paginated response { messages, total, hasMore, skip, limit }.
      // Older bug may have left an array in the cache, so handle both shapes.
      queryClient.setQueryData(
        ["messages", receiverId],
        (oldData: PaginatedMessagesResponse) => {
          // If there's no cache yet, create a minimal paginated payload
          if (!oldData) {
            return {
              messages: [newMessage],
              total: 1,
              hasMore: false,
              skip: 0,
              limit: 50,
            };
          }

          // If cache is an array (previous buggy state), convert it into the paginated shape
          if (Array.isArray(oldData)) {
            return {
              messages: [...oldData, newMessage],
              total: oldData.length + 1,
              hasMore: false,
              skip: 0,
              limit: 50,
            };
          }

          // Normal case: oldData is the paginated response
          return {
            ...oldData,
            messages: [...(oldData.messages || []), newMessage],
            total: (oldData.total ?? oldData.messages?.length ?? 0) + 1,
          };
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
