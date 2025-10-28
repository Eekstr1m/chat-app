import { Flex, Text } from "@chakra-ui/react";

export default function MessageStart() {
  return (
    <Flex
      direction={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      height={"100%"}
      textAlign={"center"}
    >
      <Text fontSize={"2rem"}>Select a chat to start messaging</Text>
    </Flex>
  );
}
