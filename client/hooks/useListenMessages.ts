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

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage");
    };
  }, [socket, queryClient, authUser, receiverId]);
};
