import {
  PaginatedMessagesResponse,
  UnreadCountI,
} from "../interfaces/MessagesInterfaces";
import { api } from "../api/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetMessages = (receiverId: string, limit: number = 50) => {
  const queryClient = useQueryClient();

  // 1. Initial fetch (skip = 0)
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["messages", receiverId],
    queryFn: async () => {
      const response = await api.get<PaginatedMessagesResponse>(
        `/messages/${receiverId}?limit=${limit}&skip=0`
      );
      // Clear unread messages counter
      queryClient.setQueryData<UnreadCountI>(["unreadMessages"], (oldData) => {
        if (!oldData) return {};
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [receiverId]: _, ...rest } = oldData;
        return rest;
      });
      return response.data;
    },
    staleTime: 0,
  });

  // 2. Load more manually
  const loadMore = async () => {
    if (!data?.hasMore) return;

    const nextSkip = data.messages.length;
    console.log("🚀 ~ loadMore ~ nextSkip:", nextSkip);

    const response = await api.get<PaginatedMessagesResponse>(
      `/messages/${receiverId}?limit=${limit}&skip=${nextSkip}`
    );

    const newMessages = response.data.messages;

    // Merge into main cache
    queryClient.setQueryData<PaginatedMessagesResponse>(
      ["messages", receiverId],
      (old) => {
        if (!old) return response.data;

        if (old.messages.find((msg) => msg._id === newMessages[0]?._id)) {
          // Already have these messages
          return old;
        }

        return {
          ...old,
          messages: [...newMessages, ...old.messages],
          hasMore: response.data.hasMore,
          total: response.data.total,
        };
      }
    );
  };

  const cacheData = queryClient.getQueryData<PaginatedMessagesResponse>([
    "messages",
    receiverId,
  ]);

  return {
    messages: cacheData?.messages || [],
    total: cacheData?.total || 0,
    hasMore: cacheData?.hasMore || false,
    isLoading,
    isFetching,
    error,
    loadMore,
  };
};
