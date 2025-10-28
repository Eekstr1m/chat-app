import {
  Avatar,
  Box,
  Circle,
  Flex,
  Float,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useGetConversations } from "../../hooks/useGetConversations";
import { UserI } from "../../interfaces/UsersInterfaces";
import { useSocketContext } from "../../context/SocketContext";
import { useUnreadMessages } from "../../hooks/useUnreadMessages";
import { Link } from "react-router";
import useSearchUsers from "../../hooks/useSearchUsers";
import { CustomSpinner } from "../Spinner/Spinner";
import { IoPersonAddOutline } from "react-icons/io5";
import { useAuthContext } from "../../context/AuthContext";
import { useFollowConversation } from "../../hooks/useFollowConversation";
import { useEffect } from "react";
import { useListenFirstMessage } from "../../hooks/useListenFirstMessage";
import ConversationSkeleton from "../Skeletons/ConversationSkeleton";
import { UnreadCountI } from "../../interfaces/MessagesInterfaces";

export default function ConversationsList({
  messageReceiver,
  searchValue,
}: {
  messageReceiver: string | undefined;
  searchValue: string;
}) {
  const {
    data: conversations,
    isLoading,
    refetch: refetchConversations,
  } = useGetConversations();
  const {
    data: searchConversations,
    isLoading: isSearchLoading,
    error: searchError,
  } = useSearchUsers(searchValue);
  useListenFirstMessage();

  const { socket } = useSocketContext();
  const { unreadCounts, refetchCounts } = useUnreadMessages();

  // Listen for new messages via socket and refetch conversations and unread counts
  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", () => {
      console.log("newMessage socket in conversations list");
      refetchConversations();
      refetchCounts();
    });

    return () => {
      socket.off("newMessage");
    };
  }, [socket, refetchConversations, refetchCounts]);

  // Refetch conversations if search is cleared
  useEffect(() => {
    if (!searchConversations) {
      refetchConversations();
    }
  }, [searchConversations, refetchConversations]);

  if (isLoading) {
    return (
      <Stack>
        <ConversationSkeleton />
        <ConversationSkeleton />
      </Stack>
    );
  }
  if (isSearchLoading) {
    return <CustomSpinner />;
  }

  if (searchError) {
    return <Text>{searchError.response?.data.error}</Text>;
  }

  if (searchConversations && searchConversations.length > 0) {
    return (
      <Flex direction={"column"}>
        {searchConversations.map((item) => (
          <Conversation
            key={item._id}
            conversationItem={item}
            messageReceiver={messageReceiver}
            unreadCounts={unreadCounts}
          />
        ))}
      </Flex>
    );
  }

  if (!conversations || conversations.length <= 0) {
    return <Text>No conversations found</Text>;
  }

  return (
    <Flex direction={"column"}>
      {(Array.isArray(conversations) ? conversations : []).map((item) => (
        <Conversation
          key={item._id}
          conversationItem={item}
          messageReceiver={messageReceiver}
          unreadCounts={unreadCounts}
        />
      ))}
    </Flex>
  );
}

function Conversation({
  conversationItem,
  messageReceiver,
  unreadCounts,
}: {
  conversationItem: UserI;
  messageReceiver: string | undefined;
  unreadCounts: UnreadCountI | undefined;
}) {
  const { onlineUsers } = useSocketContext();
  // const { unreadCounts } = useUnreadMessages();

  const isOnline = onlineUsers.includes(conversationItem._id);
  const unreadCount = unreadCounts?.[conversationItem._id] || 0;

  return (
    <Link to={`/messages/${conversationItem.userName}`}>
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
        <FollowUser conversationItem={conversationItem} />
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
      {conversationItem.avatar && (
        <Avatar.Image src={conversationItem.avatar} />
      )}
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

const FollowUser = ({ conversationItem }: { conversationItem: UserI }) => {
  const { followConversation, isLoading } = useFollowConversation();

  const { authUser } = useAuthContext();
  if (!authUser) return null;
  if (isLoading) return <CustomSpinner />;

  return (
    <div onClick={() => followConversation(conversationItem._id)}>
      {authUser.followedParticipants.includes(conversationItem._id) ? null : (
        <IoPersonAddOutline />
      )}
    </div>
  );
};

const UnreadMessagesCount = ({ unreadCount }: { unreadCount: number }) => {
  if (unreadCount > 0)
    return (
      <Circle
        className="glassmorphism"
        size="1.5rem"
        bg="primary"
        color="white"
        fontSize="xs"
        right="2"
        width={"fit-content"}
      >
        <Text>{unreadCount > 99 ? "99+" : unreadCount}</Text>
      </Circle>
    );
};
