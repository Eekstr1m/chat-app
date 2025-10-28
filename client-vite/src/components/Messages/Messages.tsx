import MessagesHeader from "./MessagesHeader";
import MessagesBlock from "./MessagesBlock/MessagesBlock";
import MessageInput from "./MessageInput/MessageInput";
import { Flex } from "@chakra-ui/react";

function Messages({ messageReceiver }: { messageReceiver: string }) {
  return (
    <Flex direction={"column"} height={"100%"}>
      <MessagesHeader messageReceiver={messageReceiver} />
      <Flex flex={1} minH={0} direction={"column"}>
        <MessagesBlock messageReceiver={messageReceiver} />
      </Flex>
      <MessageInput messageReceiver={messageReceiver} />
    </Flex>
  );
}

export default Messages;
