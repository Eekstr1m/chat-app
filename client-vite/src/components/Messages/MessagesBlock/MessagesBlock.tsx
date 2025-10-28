import { useGetMessages } from "../../../hooks/useGetMessages";
import { Center, Flex, Text } from "@chakra-ui/react";
import { useRef } from "react";
import { useAuthContext } from "../../../context/AuthContext";
import { useListenMessages } from "../../../hooks/useListenMessages";
import React from "react";
import { useListenMessageStatus } from "../../../hooks/useListenMessageStatus";
import { useMessageScroll } from "../../../hooks/useMessageScroll";
import MessageBlockSkeleton from "../../Skeletons/MessageBlockSkeleton";
import { Message } from "./Message";

export default function MessagesBlock({
  messageReceiver,
}: {
  messageReceiver: string;
}) {
  const { data: messages, isLoading } = useGetMessages(messageReceiver);
  const { authUser } = useAuthContext();

  // Listen for new messages and message status
  useListenMessages(messageReceiver);
  useListenMessageStatus(messageReceiver);

  // Refs for the first unread message and the last message
  const firstUnreadMessageRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  // Scroll to the first unread message
  const { firstUnreadIndex } = useMessageScroll({
    messages,
    firstUnreadMessageRef,
    lastMessageRef,
  });

  if (isLoading) return <MessageBlockSkeleton />;
  if (!authUser || !messages) return null;

  return (
    <Flex direction={"column"} height={"100%"} overflowY={"auto"} pr={4}>
      {messages.length > 0 ? (
        <Flex direction={"column"} mt={"auto"}>
          {messages.map((message, index) => (
            <React.Fragment key={message._id}>
              <NewMessagesDivider
                index={index}
                firstUnreadIndex={firstUnreadIndex}
                firstUnreadMessageRef={firstUnreadMessageRef}
              />

              <Message
                ref={index === messages.length - 1 ? lastMessageRef : null}
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
