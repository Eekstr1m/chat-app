import { Box, Flex } from "@chakra-ui/react";
import { UserI } from "../../interfaces/UsersInterfaces";
import ProfileInfo from "./ProfileContent/ProfileInfo";
import ProfileAvatar from "./ProfileContent/ProfileAvatar";

export default function Profile({
  user,
  isUserDataLoading,
  profileId,
}: {
  user: UserI;
  isUserDataLoading: boolean;
  profileId: string;
}) {
  return (
    <Box w="100%">
      <Flex
        // className="glassmorphismRed"
        p={4}
        borderRadius="xl"
        align={"center"}
        gap={4}
        direction={{ mdDown: "column-reverse", md: "row" }}
        position="relative"
      >
        <ProfileInfo user={user} profileId={profileId} />

        <ProfileAvatar
          user={user}
          isUserDataLoading={isUserDataLoading}
          profileId={profileId}
        />
      </Flex>
    </Box>
  );
}
