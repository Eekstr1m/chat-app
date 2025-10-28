import { useSocketContext } from "../context/SocketContext";
import { MessageI } from "../interfaces/MessagesInterfaces";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const useListenMessageStatus = (receiverId: string) => {
  const { socket } = useSocketContext();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const handleMessageStatusChange = (updatedMessage: MessageI) => {
      // Update message in cache when status changes
      queryClient.setQueryData<MessageI[]>(
        ["messages", receiverId],
        (oldMessages) => {
          if (!oldMessages) return [updatedMessage];

          return oldMessages.map((message) =>
            message._id === updatedMessage._id ? updatedMessage : message
          );
        }
      );
    };

    socket.on("messageRead", handleMessageStatusChange);

    return () => {
      socket.off("messageRead");
    };
  }, [socket, queryClient, receiverId]);
};
