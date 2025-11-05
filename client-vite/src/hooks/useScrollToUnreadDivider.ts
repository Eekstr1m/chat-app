import { RefObject, useEffect, useMemo } from "react";
import { MessageI } from "../interfaces/MessagesInterfaces";
import { useAuthContext } from "../context/AuthContext";

interface UseMessageScrollProps {
  messages: MessageI[] | undefined;
  firstUnreadMessageRef: RefObject<HTMLDivElement | null>;
  lastMessageRef: RefObject<HTMLDivElement | null>;
}

export const useScrollToUnreadDivider = ({
  messages,
  firstUnreadMessageRef,
  lastMessageRef,
}: UseMessageScrollProps) => {
  const { authUser } = useAuthContext();

  // Find the index of the first unread message
  const firstUnreadIndex = useMemo(() => {
    if (!authUser || !messages?.length) return -1;

    return messages.findIndex(
      (message) => !message.isRead && message.senderId !== authUser._id
    );
  }, [messages, authUser]);

  // Scroll to the first unread message
  useEffect(() => {
    if (!messages?.length) return;

    const scrollTimeout = setTimeout(() => {
      if (firstUnreadIndex !== -1 && firstUnreadMessageRef.current) {
        firstUnreadMessageRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      } else if (lastMessageRef.current) {
        lastMessageRef.current.scrollIntoView({
          behavior: "auto",
        });
      }
    }, 100);

    // Clear the timeout when the component unmounts
    return () => clearTimeout(scrollTimeout);
  }, [messages, firstUnreadMessageRef, lastMessageRef, firstUnreadIndex]);

  return {
    firstUnreadIndex,
  };
};
