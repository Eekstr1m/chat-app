import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { FiCalendar, FiUser } from "react-icons/fi";
import { UserI } from "../../../interfaces/UsersInterfaces";
import { MdMailOutline } from "react-icons/md";
import { useAuthContext } from "../../../context/AuthContext";
import { useFollowConversation } from "../../../hooks/useFollowConversation";
import { useNavigate } from "react-router";
import { useGetUserById } from "../../../hooks/useGetUserById";

export default function ProfileInfo({
  user,
  profileId,
}: {
  user: UserI;
  profileId: string;
}) {
  const { authUser } = useAuthContext();
  const { data: participantData } = useGetUserById(profileId);

  const fullName = `${user.firstName} ${user.lastName}`.trim();
  const joinedAt = new Date(user.createdAt);

  if (!participantData) {
    return <Box>User not found</Box>;
  }

  return (
    <Box flex="1">
      <Box
        className="transparentGlass"
        background={
          "linear-gradient(to right,rgba(0, 0, 0, 0.25) 20%, rgba(0, 0, 0, 0) 100%)"
        }
        borderRadius={"xl"}
        display="grid"
        gap={3}
        width={"fit-content"}
        padding={10}
      >
        <Heading size={"2xl"}>{fullName}</Heading>
        <Text color="whiteAlpha.700">@{user.userName}</Text>

        <Flex gap={6} color="whiteAlpha.800" align="center" wrap="wrap">
          <Flex align="center" gap={2}>
            <FiUser />
            <Text>
              Subscriptions:{" "}
              {Array.isArray(user.followedParticipants)
                ? user.followedParticipants.length
                : 0}
            </Text>
          </Flex>
          <Flex align="center" gap={2}>
            <FiCalendar />
            {!isNaN(joinedAt.getTime()) && (
              <Text>Joined: {joinedAt.toLocaleDateString()}</Text>
            )}
          </Flex>
        </Flex>

        <Box>
          <Text fontWeight="semibold">Contacts</Text>
          <Flex color="whiteAlpha.800" align="center" gap={2}>
            <MdMailOutline /> Email: {user.email}
          </Flex>
        </Box>

        {authUser?.userName !== profileId && authUser?._id !== profileId && (
          <Flex pt={2} gap={3} wrap="wrap">
            {!authUser?.followedParticipants.includes(participantData._id) && (
              <FollowButton userId={profileId} />
            )}
            <ConversationButton userId={profileId} />
          </Flex>
        )}
      </Box>
    </Box>
  );
}

function FollowButton({ userId }: { userId: string }) {
  const { followConversation } = useFollowConversation();

  const onFollowHandler = () => {
    followConversation(userId);
  };

  return (
    <Button
      flex={"1"}
      size="sm"
      colorScheme="whiteAlpha"
      variant="outline"
      onClick={onFollowHandler}
    >
      Follow
    </Button>
  );
}

function ConversationButton({ userId }: { userId: string }) {
  const navigate = useNavigate();

  const onConversationHandler = () => {
    navigate("/messages/" + userId);
  };

  return (
    <Button
      flex={"1"}
      size="sm"
      colorScheme="whiteAlpha"
      variant="solid"
      onClick={onConversationHandler}
    >
      Conversation
    </Button>
  );
}
