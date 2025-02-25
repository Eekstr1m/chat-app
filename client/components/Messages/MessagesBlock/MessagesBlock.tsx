"use client";
import { useGetMessages } from "@/hooks/useGetMessages";
import { Center, Flex, Grid, Text } from "@chakra-ui/react";
import { useEffect, useRef, forwardRef } from "react";
import { extractTime } from "@/utils/extractTime";
import { useAuthContext } from "@/context/AuthContext";
import { useListenMessages } from "@/hooks/useListenMessages";
import { useUpdateMessage } from "@/hooks/useUpdateMessage";
import React from "react";
import { CustomSpinnerWithText } from "@/components/Spinner/Spinner";
import { useMessageScroll } from "@/hooks/useMessageScroll";

export default function MessagesBlock({
  messageReceiver,
}: {
  messageReceiver: string;
}) {
  const { data: messages, isLoading } = useGetMessages(messageReceiver);
  const { authUser } = useAuthContext();

  // Listen for new messages
  useListenMessages(messageReceiver);

  // Refs for the first unread message and the last message
  const firstUnreadMessageRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  // Scroll to the first unread message
  const { firstUnreadIndex } = useMessageScroll({
    messages,
    firstUnreadMessageRef,
    lastMessageRef,
  });

  if (isLoading) return <CustomSpinnerWithText />;
  if (!authUser || !messages) return null;

  return (
    <Flex direction={"column"} height={"100%"} overflowY={"auto"} pr={4}>
      {messages.length > 0 ? (
        messages.map((message, index) => (
          <React.Fragment key={message._id}>
            <NewMessagesDivider
              index={index}
              firstUnreadIndex={firstUnreadIndex}
              firstUnreadMessageRef={firstUnreadMessageRef}
            />

            <Message
              ref={index === messages.length - 1 ? lastMessageRef : null}
              // ref={
              //   index === firstUnreadIndex
              //     ? firstUnreadMessageRef
              //     : index === messages.length - 1
              //     ? lastMessageRef
              //     : null
              // }
              messageId={message._id}
              isRead={message.isRead}
              text={message.message}
              actor={message.senderId === authUser._id ? "sender" : "receiver"}
              time={message.createdAt}
            />
          </React.Fragment>
        ))
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

// Message component
const Message = forwardRef<HTMLDivElement, MessageProps>(
  ({ text, actor, time, messageId, isRead }, ref) => {
    const { updateMessage } = useUpdateMessage();
    const messageRef = useRef<HTMLDivElement>(null);

    // Update the message as read when it's in the viewport
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && actor === "receiver" && !isRead) {
            updateMessage(messageId);
          }
        },
        { threshold: 1.0 }
      );

      if (messageRef.current) {
        observer.observe(messageRef.current);
      }

      return () => observer.disconnect();
    }, [actor, isRead, messageId, updateMessage]);

    return (
      <Flex
        ref={ref}
        px={4}
        py={1}
        my={1}
        className={actor === "sender" ? "glassmorphism" : "glassmorphismChat"}
        borderRadius="lg"
        w="fit-content"
        maxW={"80%"}
        wordBreak={"break-word"}
        alignSelf={actor === "sender" ? "flex-end" : "flex-start"}
      >
        <Grid
          ref={messageRef}
          templateColumns={"auto auto"}
          alignItems={"end"}
          gap={2}
        >
          <Text>{text}</Text>
          <Text color={"gray.500"} lineHeight={"1"}>
            {extractTime(time)}
          </Text>
        </Grid>
      </Flex>
    );
  }
);

Message.displayName = "Message";

type MessageProps = {
  text: string;
  actor: "sender" | "receiver";
  time: Date;
  isRead: boolean;
  messageId: string;
};
