import { Box } from "@chakra-ui/react";
import { useGetUserById } from "../../hooks/useGetUserById";
import Profile from "./Profile";
import { CustomSpinnerWithText } from "../Spinner/Spinner";

export default function ProfilePage({ profileId }: { profileId: string }) {
  const { data, isLoading } = useGetUserById(profileId);

  if (isLoading) {
    return <CustomSpinnerWithText />;
  }

  if (!data) {
    return <Box>User not found</Box>;
  }

  return (
    <Profile user={data} isUserDataLoading={isLoading} profileId={profileId} />
  );
}
