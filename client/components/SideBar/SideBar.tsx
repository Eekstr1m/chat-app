import React from "react";
import Search from "./Search";
import ConversationsList from "./ConversationsList";
import { Box } from "@chakra-ui/react";

function SideBar({ messageReceiver }: { messageReceiver: string }) {
  return (
    <Box
      height={"100%"}
      pr={4}
      borderRight={"1px solid"}
      borderColor={"gray.700"}
    >
      <Search />
      <ConversationsList messageReceiver={messageReceiver} />
    </Box>
  );
}

export default SideBar;
