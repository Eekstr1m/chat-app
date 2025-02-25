"use client";
import React from "react";
import MessagesHeader from "./MessagesHeader";
import MessagesBlock from "./MessagesBlock/MessagesBlock";
import MessageInput from "./MessageInput";
import { Flex } from "@chakra-ui/react";

function Messages({ messageReceiver }: { messageReceiver: string }) {
  return (
    <Flex direction={"column"} height={"100%"}>
      <MessagesHeader messageReceiver={messageReceiver} />
      <MessagesBlock messageReceiver={messageReceiver} />
      <MessageInput messageReceiver={messageReceiver} />
    </Flex>
  );
}

export default Messages;
