import { useParams } from "react-router";
import Messages from "../../components/Messages/Messages";
import { useGetUserById } from "../../hooks/useGetUserById";

export default function MessagesReceiver() {
  const { messageReceiver } = useParams();

  // Get valid receiver id
  const { data: userData } = useGetUserById(messageReceiver!);
  if (!userData) return null;

  if (!messageReceiver) return null;

  return <Messages messageReceiver={userData._id} />;
}
