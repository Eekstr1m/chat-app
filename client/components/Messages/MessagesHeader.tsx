import { useGetUserById } from "../../hooks/useGetUserById";
import { Avatar, Box, Flex, HStack, Stack, Text } from "@chakra-ui/react";
import { Skeleton, SkeletonCircle } from "../../components/ui/skeleton";
import { useSocketContext } from "../../context/SocketContext";

export default function MessagesHeader({
  messageReceiver,
}: {
  messageReceiver: string;
}) {
  const { data: messageReceiverData, isLoading } =
    useGetUserById(messageReceiver);
  const { onlineUsers } = useSocketContext();

  if (isLoading) return <MessagesHeaderSkeleton />;
  if (!messageReceiverData) return null;

  const isOnline = onlineUsers.includes(messageReceiver);

  return (
    <Flex gap={4} shadow={"lg"} p={1}>
      <Avatar.Root variant="subtle">
        <Avatar.Fallback
          name={`${messageReceiverData.firstName} ${messageReceiverData.lastName}`}
        />
        <Avatar.Image src={messageReceiverData.avatar} />
      </Avatar.Root>
      <Box lineHeight={"1.2"}>
        <Text fontSize={"1.2rem"}>
          {messageReceiverData.firstName} {messageReceiverData.lastName}
        </Text>
        <Text color={isOnline ? "green.300" : "gray.400"}>
          {isOnline ? "online" : "offline"}
        </Text>
      </Box>
    </Flex>
  );
}

function MessagesHeaderSkeleton() {
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
