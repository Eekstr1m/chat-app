import { useParams } from "react-router";
import ProfilePage from "../../components/Profile/ProfilePage";

export default function ProfileReceiver() {
  const { profileId } = useParams();

  if (!profileId) return null;

  return <ProfilePage profileId={profileId} />;
}
