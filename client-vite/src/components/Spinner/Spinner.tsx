import { Center, VStack, Spinner, Text } from "@chakra-ui/react";

export function CustomSpinnerWithText() {
  return (
    <Center height={"100%"}>
      <VStack>
        <Spinner size="lg" />
        <Text>Loading...</Text>
      </VStack>
    </Center>
  );
}

export function CustomSpinner() {
  return (
    <Center width={"100%"}>
      <Spinner size="lg" />
    </Center>
  );
}
