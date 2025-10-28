import { api } from "../api/api";
import { useQuery } from "@tanstack/react-query";
import { UnreadCountI } from "../interfaces/MessagesInterfaces";

export const useUnreadMessages = () => {
  const { data: unreadCounts, refetch: refetchCounts } = useQuery<UnreadCountI>(
    {
      queryKey: ["unreadMessages"],
      queryFn: async () => {
        const response = await api.get("/messages/unread");
        return response.data;
      },
    }
  );

  return { unreadCounts, refetchCounts };
};
