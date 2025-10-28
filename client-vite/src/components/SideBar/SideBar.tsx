import Search from "./Search";
import ConversationsList from "./ConversationsList";
import { Box } from "@chakra-ui/react";
import { useState } from "react";

function SideBar({ messageReceiver }: { messageReceiver: string | undefined }) {
  const [searchValue, setSearchValue] = useState("");

  return (
    <Box
      height={"100%"}
      md={{
        borderRight: "1px solid",
        borderColor: "gray.700",
        paddingRight: "4",
      }}
    >
      <Search setSearchValue={setSearchValue} />
      <ConversationsList
        searchValue={searchValue}
        messageReceiver={messageReceiver}
      />
    </Box>
  );
}

export default SideBar;
