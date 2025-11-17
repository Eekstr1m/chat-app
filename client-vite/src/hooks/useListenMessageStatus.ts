import { useSocketContext } from "../context/SocketContext";
import {
  MessageI,
  PaginatedMessagesResponse,
} from "../interfaces/MessagesInterfaces";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const useListenMessageStatus = (receiverId: string) => {
  const { socket } = useSocketContext();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const handleMessageStatusChange = (updatedMessage: MessageI) => {
      // Update message in cache when status changes
      queryClient.setQueryData<PaginatedMessagesResponse | MessageI[]>(
        ["messages", receiverId],
        (oldMessages) => {
          if (!oldMessages) return [updatedMessage];

          // Handle legacy array format
          if (Array.isArray(oldMessages)) {
            return oldMessages.map((message) =>
              message._id === updatedMessage._id ? updatedMessage : message
            );
          }

          // Handle paginated response format
          const pag = oldMessages as PaginatedMessagesResponse;
          return {
            ...pag,
            messages: pag.messages.map((message) =>
              message._id === updatedMessage._id ? updatedMessage : message
            ),
          } as PaginatedMessagesResponse;
        }
      );
    };

    socket.on("messageRead", handleMessageStatusChange);

    return () => {
      socket.off("messageRead", handleMessageStatusChange);
    };
  }, [socket, queryClient, receiverId]);
};
