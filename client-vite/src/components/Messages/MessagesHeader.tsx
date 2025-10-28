import { useGetUserById } from "../../hooks/useGetUserById";
import {
  Avatar,
  Box,
  Center,
  Flex,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Skeleton, SkeletonCircle } from "../../components/ui/skeleton";
import { useSocketContext } from "../../context/SocketContext";
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router";
import useLastOnline from "../../hooks/useLastOnline";
import useListenLastOnline from "../../hooks/useListenLastOnline";

export default function MessagesHeader({
  messageReceiver,
}: {
  messageReceiver: string;
}) {
  const { data: messageReceiverData, isLoading } =
    useGetUserById(messageReceiver);
  const { onlineUsers } = useSocketContext();
  const navigate = useNavigate();

  // Listen for changes in user's last online status
  useListenLastOnline();

  if (isLoading) return <MessagesHeaderSkeleton />;
  if (!messageReceiverData) return null;

  const isOnline = onlineUsers.includes(messageReceiver);

  return (
    <Flex
      className="glassmorphism"
      gap={4}
      p={2}
      shadow={"md"}
      zIndex={100}
      background={"transparent"}
    >
      <Center cursor={"pointer"} ml={2} onClick={() => navigate("/messages")}>
        <IoArrowBackOutline size={"1.2rem"} />
      </Center>
      <Avatar.Root
        variant="subtle"
        cursor={"pointer"}
        onClick={() => navigate("/profile/" + messageReceiverData.userName)}
      >
        <Avatar.Fallback
          name={`${messageReceiverData.firstName} ${messageReceiverData.lastName}`}
        />
        {messageReceiverData.avatar && (
          <Avatar.Image src={messageReceiverData.avatar} />
        )}
      </Avatar.Root>
      <Box lineHeight={"1.2"}>
        <Text fontSize={"1.2rem"}>
          {messageReceiverData.firstName} {messageReceiverData.lastName}
        </Text>
        <LastOnline
          isOnline={isOnline}
          lastOnlineDate={messageReceiverData.lastOnline}
        />
      </Box>
    </Flex>
  );
}

function LastOnline({
  isOnline,
  lastOnlineDate,
}: {
  isOnline: boolean;
  lastOnlineDate: Date;
}) {
  const { convertedDay, convertedTime, isToday } =
    useLastOnline(lastOnlineDate);

  return (
    <Text color={isOnline ? "green.300" : "gray.400"}>
      {isOnline
        ? "online"
        : `last seen at ${
            !isToday ? `${convertedDay} -` : ""
          } ${convertedTime}`}
    </Text>
  );
}

function MessagesHeaderSkeleton() {
  const skeletonCSS = {
    "--start-color": "colors.skeleton",
    "--end-color": "colors.skeleton.100",
  };
  return (
    <HStack gap={2} p={2} shadow={"lg"}>
      <SkeletonCircle variant="shine" css={skeletonCSS} size="10" />
      <Stack flex="1">
        <Skeleton variant="shine" css={skeletonCSS} height="5" width="60%" />
        <Skeleton variant="shine" css={skeletonCSS} height="3" width="40%" />
      </Stack>
    </HStack>
  );
}
