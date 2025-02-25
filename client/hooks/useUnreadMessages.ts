import { api } from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import { UnreadCountI } from "@/interfaces/MessagesInterfaces";
export const useUnreadMessages = () => {
  // Get unread messages count
  const { data: unreadCounts } = useQuery<UnreadCountI>({
    queryKey: ["unreadMessages"],
    queryFn: async () => {
      const response = await api.get("/messages/unread");
      return response.data;
    },
  });

  return { unreadCounts };
};
