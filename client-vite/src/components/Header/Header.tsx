"use client";
import { Box, Flex, Heading, Mark, Text } from "@chakra-ui/react";
import LogOut from "./LogOut";
import { useAuthContext } from "../../context/AuthContext";
import PageSwitchButton from "./PageSwitchButton";

export default function Header() {
  const { authUser } = useAuthContext();
  return (
    <Flex
      justifyContent={"space-between"}
      alignItems={"center"}
      borderBottom={"1px solid"}
      borderColor={"gray.700"}
      pb={2}
    >
      <Box>
        <Heading
          as={"h1"}
          fontSize={"2rem"}
          color={"primary"}
          fontStyle={"italic"}
          mb={2}
        >
          Chat App
        </Heading>
        <Text>
          Welcome,{" "}
          <Mark fontStyle={"italic"}>
            {authUser?.firstName} {authUser?.lastName}
          </Mark>
        </Text>
      </Box>
      <Flex alignItems={"center"} gap={4}>
        <PageSwitchButton />
        <LogOut />
      </Flex>
    </Flex>
  );
}
