import { useGetMessages } from "../../../hooks/useGetMessages";
import { Box, Center, Flex, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "../../../context/AuthContext";
import { useListenMessages } from "../../../hooks/useListenMessages";
import React from "react";
import { useListenMessageStatus } from "../../../hooks/useListenMessageStatus";
import { useScrollToUnreadDivider } from "../../../hooks/useScrollToUnreadDivider";
import MessageBlockSkeleton from "../../Skeletons/MessageBlockSkeleton";
import { Message } from "./Message";
import { FaChevronDown } from "react-icons/fa";

export default function MessagesBlock({
  messageReceiver,
  setReplyTo,
}: {
  messageReceiver: string;
  setReplyTo: React.Dispatch<
    React.SetStateAction<{ id: string; preview: string | null } | null>
  >;
}) {
  const { data: messages, isLoading } = useGetMessages(messageReceiver);
  const { authUser } = useAuthContext();

  // Listen for new messages and message status
  useListenMessages(messageReceiver);
  useListenMessageStatus(messageReceiver);

  // Refs for the first unread message and the last message
  const firstUnreadMessageRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  // Track the id of the last message we handled so we only react to truly new messages
  const lastMessageIdRef = useRef<string | null>(null);

  // Refs for all messages to handle reply click
  const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Handle reply click to scroll to the replied message
  const handleReplyClick = (repliedToMessageId: string) => {
    const targetMessageRef = messageRefs.current[repliedToMessageId];
    if (targetMessageRef) {
      targetMessageRef.scrollIntoView({ behavior: "smooth", block: "center" });

      // Add highlight effect after element is in view
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          targetMessageRef.classList.add("highlighted-message");
          setTimeout(
            () => targetMessageRef.classList.remove("highlighted-message"),
            1500
          );
          observer.disconnect();
        }
      });

      observer.observe(targetMessageRef);
    }
  };

  // track whether user is near bottom (actively viewing latest messages)
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);

  // Utility: check if an element is visible within a scrollable container
  function isLastElementVisibleInContainer(): boolean {
    if (!lastMessageRef.current || !containerRef.current) return false;
    const elemRect = lastMessageRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    const threshold = 0; // px from bottom to consider "at bottom"

    // Check if element is fully or partially within the container's visible area
    return (
      elemRect.top < containerRect.bottom + threshold &&
      elemRect.bottom > containerRect.top + threshold
    );
  }

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scrollTimeout: NodeJS.Timeout;
    const checkAtBottom = () => {
      // Clear any pending timeouts
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      // Debounce delay in ms
      const debounceDelay = 400;

      // Debounce the check to avoid too many state updates
      scrollTimeout = setTimeout(() => {
        const isVisible = isLastElementVisibleInContainer();

        // Only update state if the value actually changed
        setIsAtBottom((prev) => {
          if (prev !== isVisible) {
            return isVisible;
          }
          return prev;
        });
      }, debounceDelay);
    };

    // Initial check and on scroll
    checkAtBottom();
    container.addEventListener("scroll", checkAtBottom, { passive: true });

    return () => {
      container.removeEventListener("scroll", checkAtBottom);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [messages]);

  useEffect(() => {
    // Only auto-scroll when the last message is newly added.
    // If the last message was sent by the current user -> always scroll.
    // If the last message was sent by someone else -> scroll only when
    // the viewer is already at the bottom (isAtBottom === true).
    if (!messages || messages.length === 0 || !authUser) return;

    const last = messages[messages.length - 1];
    const lastId = last._id;

    // ignore updates that don't add a new message (e.g. status updates)
    if (lastMessageIdRef.current === lastId) return;
    lastMessageIdRef.current = lastId;

    const isOwnMessage = last.senderId === authUser._id;
    if (isOwnMessage || isAtBottom) {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isAtBottom, authUser]);

  // Scroll to the first unread message
  const { firstUnreadIndex } = useScrollToUnreadDivider({
    messages,
    firstUnreadMessageRef,
    lastMessageRef,
  });

  // Scroll to bottom utility
  const scrollToBottom = () => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (isLoading) return <MessageBlockSkeleton />;
  if (!authUser || !messages) return null;

  return (
    <Flex
      ref={containerRef}
      direction={"column"}
      height={"100%"}
      overflowY={"auto"}
      pr={4}
    >
      {messages.length > 0 ? (
        <Flex direction={"column"} mt={"auto"}>
          {messages.map((message, index) => (
            <React.Fragment key={message._id}>
              {!isAtBottom && (
                <NewMessagesDivider
                  index={index}
                  firstUnreadIndex={firstUnreadIndex}
                  firstUnreadMessageRef={firstUnreadMessageRef}
                />
              )}

              <Message
                // Handle reply click to scroll to replied message
                onReplyClick={handleReplyClick}
                ref={(el) => {
                  // keep per-message refs map
                  messageRefs.current[message._id] = el;
                  // also update the lastMessageRef when this is the last message
                  if (index === messages.length - 1) {
                    lastMessageRef.current = el;
                  }
                }}
                // Pass onReply to lift reply action to this component
                repliedTo={message.repliedTo ?? null}
                onReply={(payload) => setReplyTo(payload)}
                // Other message props
                messageId={message._id}
                isRead={message.isRead}
                text={message.message}
                actor={
                  message.senderId === authUser._id ? "sender" : "receiver"
                }
                contentType={message.contentType}
                time={message.createdAt}
              />
            </React.Fragment>
          ))}
          {!isAtBottom && <ScrollToBottomButton onClick={scrollToBottom} />}
        </Flex>
      ) : (
        <Center height={"100%"}>
          <Text fontSize={"2rem"}>No messages yet</Text>
        </Center>
      )}
    </Flex>
  );
}

// Divider for new messages
const NewMessagesDivider = ({
  index,
  firstUnreadIndex,
  firstUnreadMessageRef,
}: {
  index: number;
  firstUnreadIndex: number;
  firstUnreadMessageRef: React.RefObject<HTMLDivElement | null>;
}) => {
  if (index === firstUnreadIndex && firstUnreadIndex !== -1)
    return (
      <Flex ref={firstUnreadMessageRef} className="glassmorphism">
        <Text
          width={"100%"}
          textAlign={"center"}
          fontSize={"sm"}
          color={"gray.400"}
        >
          New Messages
        </Text>
      </Flex>
    );
};

// Scroll to Bottom Button
const ScrollToBottomButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Box
      className="glassmorphismChat"
      position={"absolute"}
      zIndex={99}
      bottom={"6rem"}
      right={"4rem"}
      p={2}
      cursor={"pointer"}
      onClick={onClick}
    >
      <FaChevronDown />
    </Box>
  );
};
