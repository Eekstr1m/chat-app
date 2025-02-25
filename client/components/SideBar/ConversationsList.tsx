"use client";
import {
  Avatar,
  Box,
  Circle,
  Flex,
  Float,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Skeleton, SkeletonCircle } from "../../components/ui/skeleton";
import React from "react";
import { useGetConversations } from "../../hooks/useGetConversations";
import { UserI } from "../../interfaces/UsersInterfaces";
import Link from "next/link";
import { useSocketContext } from "../../context/SocketContext";
import { useUnreadMessages } from "../../hooks/useUnreadMessages";

export default function ConversationsList({
  messageReceiver,
}: {
  messageReceiver: string;
}) {
  const { data: conversations, isLoading } = useGetConversations();

  return (
    <Flex direction={"column"}>
      {isLoading ? (
        <Stack>
          <ConversationSkeleton />
          <ConversationSkeleton />
        </Stack>
      ) : conversations ? (
        conversations.map((item) => (
          <Conversation
            key={item._id}
            conversationItem={item}
            messageReceiver={messageReceiver}
          />
        ))
      ) : (
        <Text>No conversations found</Text>
      )}
    </Flex>
  );
}

function ConversationSkeleton() {
  const skeletonCSS = {
    "--start-color": "colors.skeleton",
    "--end-color": "colors.skeleton.100",
  };
  return (
    <HStack gap={2} p={2}>
      <SkeletonCircle variant="shine" css={skeletonCSS} size="10" />
      <Stack flex="1">
        <Skeleton variant="shine" css={skeletonCSS} height="5" width="60%" />
        <Skeleton variant="shine" css={skeletonCSS} height="3" width="40%" />
      </Stack>
    </HStack>
  );
}

function Conversation({
  conversationItem,
  messageReceiver,
}: {
  conversationItem: UserI;
  messageReceiver: string;
}) {
  const { onlineUsers } = useSocketContext();
  const { unreadCounts } = useUnreadMessages();

  const isOnline = onlineUsers.includes(conversationItem._id);
  const unreadCount = unreadCounts?.[conversationItem._id] || 0;

  return (
    <Link href={`/messages/${conversationItem._id}`}>
      <Flex
        className={
          messageReceiver === conversationItem._id ? "glassmorphism" : undefined
        }
        p={2}
        alignItems={"center"}
        gap={4}
        position="relative"
      >
        <UserAvatar conversationItem={conversationItem} isOnline={isOnline} />
        <UserDescription conversationItem={conversationItem} />
        <UnreadMessagesCount unreadCount={unreadCount} />
      </Flex>
    </Link>
  );
}

const UserAvatar = ({
  conversationItem,
  isOnline,
}: {
  conversationItem: UserI;
  isOnline: boolean;
}) => {
  return (
    <Avatar.Root variant="subtle">
      <Avatar.Fallback
        name={`${conversationItem.firstName} ${conversationItem.lastName}`}
      />
      <Avatar.Image src={conversationItem.avatar} />
      <Float placement="bottom-end" offsetX="1" offsetY="1">
        <Circle
          bg={isOnline ? "green.500" : "gray.500"}
          size="8px"
          outline="0.2em solid"
          outlineColor="bg"
        />
      </Float>
    </Avatar.Root>
  );
};

const UserDescription = ({ conversationItem }: { conversationItem: UserI }) => {
  return (
    <Box flex="1">
      <Text>{`${conversationItem.firstName} ${conversationItem.lastName}`}</Text>
      <Text fontSize={"0.8rem"} color={"gray.400"}>
        {conversationItem.userName}
      </Text>
    </Box>
  );
};

const UnreadMessagesCount = ({ unreadCount }: { unreadCount: number }) => {
  if (unreadCount > 0)
    return (
      <Circle
        size="20px"
        bg="primary"
        color="white"
        fontSize="xs"
        position="absolute"
        right="2"
      >
        {unreadCount}
      </Circle>
    );
};
