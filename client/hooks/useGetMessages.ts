import { MessageI, UnreadCountI } from "../interfaces/MessagesInterfaces";
import { api } from "../api/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetMessages = (receiverId: string) => {
  const queryClient = useQueryClient();

  // Get messages from the server
  const { data, isLoading, error } = useQuery({
    queryKey: ["messages", receiverId],
    queryFn: async () => {
      const response = await api.get<MessageI[]>(`/messages/${receiverId}`);

      // Clear unread messages counter
      queryClient.setQueryData<UnreadCountI>(["unreadMessages"], (oldData) => {
        if (!oldData) return {};
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [receiverId]: _, ...rest } = oldData;
        return rest;
      });

      return response.data;
    },
  });

  return { data, isLoading, error };
};
