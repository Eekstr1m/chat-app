import { RefObject, useEffect, useMemo } from "react";
import { MessageI } from "../interfaces/MessagesInterfaces";
import { useAuthContext } from "../context/AuthContext";

interface UseMessageScrollProps {
  messages: MessageI[] | undefined;
  firstRender: RefObject<boolean>;
  lastMessageRef: RefObject<HTMLDivElement | null>;
}

export const useScrollToUnreadDivider = ({
  messages,
  firstRender,
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

  // Auto-scroll when user opens chat OR to first unread message
  useEffect(() => {
    if (!messages?.length) return;

    if (firstRender.current) {
      firstRender.current = false;

      // Scroll to first unread if exists
      if (firstUnreadIndex !== -1) {
        const targetId = messages[firstUnreadIndex]._id;
        const targetEl = document.getElementById(`msg-${targetId}`);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }
      }

      // fallback → scroll to bottom
      lastMessageRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [messages, firstUnreadIndex, lastMessageRef, firstRender]);

  return {
    firstUnreadIndex,
  };
};
