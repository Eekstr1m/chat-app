import { useSocketContext } from "../context/SocketContext";
import { MessageI, UnreadCountI } from "../interfaces/MessagesInterfaces";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";

export const useListenMessages = (receiverId: string) => {
  const { socket } = useSocketContext();
  const queryClient = useQueryClient();
  const { authUser } = useAuthContext();

  useEffect(() => {
    if (!socket || !authUser) return;

    const handleNewMessage = (message: MessageI) => {
      // Update messages if the message is for current chat
      if (
        message.senderId === receiverId ||
        message.receiverId === receiverId
      ) {
        queryClient.setQueryData<MessageI[]>(
          ["messages", receiverId],
          (oldData) => {
            if (!oldData) return [message];
            // Prevent duplicates by checking _id
            const exists = oldData.some((m) => m._id === message._id);
            if (exists) return oldData;
            return [...oldData, message];
          }
        );
      }

      // Update unread count only for received messages in other chats
      if (
        message.receiverId === authUser._id &&
        message.senderId !== receiverId
      ) {
        queryClient.setQueryData<UnreadCountI>(
          ["unreadMessages"],
          (oldData) => {
            const newData = {
              ...oldData,
              [message.senderId]: (oldData?.[message.senderId] || 0) + 1,
            };
            return newData;
          }
        );
      }
    };

    const handleMessageDeleted = ({ messageId }: { messageId: string }) => {
      queryClient.setQueryData<MessageI[]>(
        ["messages", receiverId],
        (oldMessages) =>
          oldMessages?.filter((msg) => msg._id !== messageId) ?? []
      );
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messageDeleted", handleMessageDeleted);

    return () => {
      socket.off("newMessage");
      socket.off("messageDeleted", handleMessageDeleted);
    };
  }, [socket, queryClient, authUser, receiverId]);
};
