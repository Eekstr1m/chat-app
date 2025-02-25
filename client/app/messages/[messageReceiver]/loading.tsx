import { Center, Spinner, Text, VStack } from "@chakra-ui/react";

export default function Loading() {
  return (
    <Center height={"100%"} w={"100%"}>
      <VStack>
        <Spinner size="lg" />
        <Text>Loading...</Text>
      </VStack>
    </Center>
  );
}
