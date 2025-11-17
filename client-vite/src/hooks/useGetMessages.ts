import {
  PaginatedMessagesResponse,
  UnreadCountI,
} from "../interfaces/MessagesInterfaces";
import { api } from "../api/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// export const useGetMessages = (receiverId: string, limit: number = 50) => {
//   const queryClient = useQueryClient();
//   const [skip, setSkip] = useState(0);

//   // Get messages from the server with pagination
//   const { data, isLoading, error, isFetching } = useQuery({
//     queryKey: ["messages", receiverId, skip],
//     queryFn: async () => {
//       const response = await api.get<PaginatedMessagesResponse>(
//         `/messages/${receiverId}?limit=${limit}&skip=${skip}`
//       );

//       // Якщо skip = 0 → повне оновлення кешу
//       if (skip === 0) {
//         return response.data;
//       }

//       // Якщо підвантажуємо старі — мерджимо
//       const old = queryClient.getQueryData<PaginatedMessagesResponse>([
//         "messages",
//         receiverId,
//       ]);

//       // Merge new messages with existing ones in cache
//       // queryClient.setQueryData<PaginatedMessagesResponse>(
//       //   ["messages", receiverId],
//       //   (oldData) => {
//       //     // If this is the first load, return as is
//       //     if (skip === 0 || !oldData) {
//       //       return response.data;
//       //     }

//       //     // Merge new messages with existing ones (prepend because older messages come first)
//       //     const merged = {
//       //       ...response.data,
//       //       messages: [...response.data.messages, ...oldData.messages],
//       //       total: response.data.total,
//       //     } as PaginatedMessagesResponse;

//       //     return merged;
//       //   }
//       // );

//       // Clear unread messages counter
//       queryClient.setQueryData<UnreadCountI>(["unreadMessages"], (oldData) => {
//         if (!oldData) return {};
//         // eslint-disable-next-line @typescript-eslint/no-unused-vars
//         const { [receiverId]: _, ...rest } = oldData;
//         return rest;
//       });

//       // return response.data;
//       return {
//         ...response.data,
//         messages: [...response.data.messages, ...(old?.messages || [])],
//       };
//     },
//   });

//   // Function to load more messages
//   const loadMore = () => {
//     if (data?.hasMore) {
//       setSkip((prev) => prev + limit);
//     }
//   };

//   // Get the merged messages from the main cache key
//   const cacheData = queryClient.getQueryData<PaginatedMessagesResponse>([
//     "messages",
//     receiverId,
//   ]);

//   return {
//     messages: cacheData?.messages || [],
//     total: cacheData?.total || 0,
//     hasMore: data?.hasMore || false,
//     isLoading,
//     isFetching,
//     error,
//     loadMore,
//   };
// };

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
