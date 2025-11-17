import { useSocketContext } from "../context/SocketContext";
import {
  MessageI,
  PaginatedMessagesResponse,
  UnreadCountI,
} from "../interfaces/MessagesInterfaces";
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
        queryClient.setQueryData<PaginatedMessagesResponse>(
          ["messages", receiverId],
          (oldData) => {
            // no cache -> create minimal paginated payload
            if (!oldData) {
              return {
                messages: [message],
                total: 1,
                hasMore: false,
                skip: 0,
                limit: 50,
              } as PaginatedMessagesResponse;
            }

            // If cache is an array (legacy/broken), append if missing
            if (Array.isArray(oldData)) {
              const exists = oldData.some((m) => m._id === message._id);
              if (exists) {
                return {
                  messages: oldData,
                  total: oldData.length,
                  hasMore: false,
                  skip: 0,
                  limit: 50,
                } as PaginatedMessagesResponse;
              }
              return {
                messages: [...oldData, message],
                total: oldData.length + 1,
                hasMore: false,
                skip: 0,
                limit: 50,
              } as PaginatedMessagesResponse;
            }

            // Normal paginated payload
            const pag = oldData as PaginatedMessagesResponse;
            const exists = pag.messages.some((m) => m._id === message._id);
            if (exists) return pag;
            return {
              ...pag,
              messages: [...pag.messages, message],
              total: pag.total + 1,
            } as PaginatedMessagesResponse;
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
      queryClient.setQueryData<PaginatedMessagesResponse | MessageI[]>(
        ["messages", receiverId],
        (oldData) => {
          if (!oldData) return oldData ?? [];

          if (Array.isArray(oldData)) {
            return oldData.filter((msg) => msg._id !== messageId);
          }

          const pag = oldData as PaginatedMessagesResponse;
          const filtered = pag.messages.filter((msg) => msg._id !== messageId);
          return {
            ...pag,
            messages: filtered,
            total: Math.max(
              0,
              pag.total - (pag.messages.length - filtered.length)
            ),
          } as PaginatedMessagesResponse;
        }
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
