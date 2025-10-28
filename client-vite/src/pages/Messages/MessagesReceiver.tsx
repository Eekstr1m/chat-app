import { useParams } from "react-router";
import Messages from "../../components/Messages/Messages";

export default function MessagesReceiver() {
  const { messageReceiver } = useParams();

  if (!messageReceiver) return null;

  return <Messages messageReceiver={messageReceiver} />;
}
