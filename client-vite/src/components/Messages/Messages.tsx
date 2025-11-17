import { Flex } from "@chakra-ui/react";
import MessagesHeader from "./MessagesHeader";
import MessagesBlock from "./MessagesBlock/MessagesBlock";
import { useState } from "react";
import MessageInput from "./MessageInput/MessageInput";

function Messages({ messageReceiver }: { messageReceiver: string }) {
  // State for replyTo message
  const [replyTo, setReplyTo] = useState<{
    id: string;
    preview: string | null;
    type: string;
  } | null>(null);

  return (
    <Flex direction={"column"} height={"100%"}>
      <MessagesHeader messageReceiver={messageReceiver} />
      <Flex flex={1} minH={0} direction={"column"}>
        <MessagesBlock
          messageReceiver={messageReceiver}
          setReplyTo={setReplyTo}
        />
      </Flex>
      <MessageInput
        messageReceiver={messageReceiver}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
        onSent={() => setReplyTo(null)}
      />
    </Flex>
  );
}

export default Messages;
