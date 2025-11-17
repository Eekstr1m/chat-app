import { Box, Flex, Input, Spinner, Text } from "@chakra-ui/react";
import { InputGroup } from "../../ui/input-group";
import { IoMdSend } from "react-icons/io";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { useSendMessage } from "../../../hooks/useSendMessage";
import { useGetMessages } from "../../../hooks/useGetMessages";
import { useFollowConversation } from "../../../hooks/useFollowConversation";
import { isDesktop } from "react-device-detect";
import EmojiButton from "./EmojiButton";
import VoiceButton from "./VoiceButton";
import { IoClose } from "react-icons/io5";

export default function MessageInput({
  messageReceiver,
  replyTo,
  onCancelReply,
  onSent,
}: {
  messageReceiver: string;
  replyTo?: { id: string; preview: string | null; type: string } | null;
  onCancelReply?: () => void;
  onSent?: () => void;
}) {
  // Hook for handling sending messages
  const { sendMessage, isLoading, isSuccess } = useSendMessage(messageReceiver);

  // Creating form
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    setValue,
    getValues,
    watch,
  } = useForm<{ message: string }>();

  // Get messages
  const { messages: messagesList, isLoading: isMessagesLoading } =
    useGetMessages(messageReceiver);
  const { followConversation } = useFollowConversation();

  const onSubmit = ({ message }: { message: string }) => {
    // Send only if message exist
    if (message) {
      // include repliedTo id when sending a reply
      sendMessage({
        message,
        contentType: "text",
        repliedTo: replyTo?.id,
      });
      reset();
      setFocus("message");
    }
  };

  useEffect(() => {
    // Auto-follow conversations after first successful message
    if (isSuccess && messagesList && messagesList.length === 1) {
      followConversation(messageReceiver);
    }
  }, [followConversation, isSuccess, messagesList, messageReceiver]);

  useEffect(() => {
    // Set focus on input field
    if (!isLoading || !isMessagesLoading || !!messagesList) {
      setFocus("message");
    }
  }, [setFocus, isLoading, isMessagesLoading, messagesList]);

  // Clear reply state after successful send
  useEffect(() => {
    if (isSuccess && replyTo) {
      onSent?.();
    }
    // only run when isSuccess changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  // Create input ref
  const { ref: registerRef, ...rest } = register("message");
  const inputRef = useRef<HTMLInputElement>(null);

  // Get recording state from VoiceButton component
  const [isRecordingInProgress, setIsRecordingInProgress] = useState(false);

  // Check if message value exists
  const isMessageValueExists = watch("message")?.length > 0;

  return (
    <Flex
      as={"form"}
      alignItems={"center"}
      justifyContent={"center"}
      mt={4}
      // gap={2}
      position={"relative"}
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Reply preview box */}
      {replyTo && (
        <Box
          position="absolute"
          top="-3.5rem"
          left={0}
          right={8}
          className="glassmorphism"
          borderRadius={"1rem"}
          py={2}
          px={3}
          display="flex"
          alignItems="center"
          gap={2}
          zIndex={2}
        >
          <Text
            className="replied-message"
            borderRadius="sm"
            w={"100%"}
            p={1.5}
            fontSize="sm"
            truncate={true}
            color="gray.200"
          >
            {replyTo.type.startsWith("audio/")
              ? "Audio message"
              : replyTo.preview ?? "Message"}
          </Text>

          <IoClose
            cursor={"pointer"}
            size={"1.5rem"}
            color="gray"
            onClick={onCancelReply}
            onMouseEnter={(target) => {
              target.currentTarget.style.color = "white";
            }}
            onMouseLeave={(target) => {
              target.currentTarget.style.color = "gray";
            }}
          />
        </Box>
      )}

      {!isRecordingInProgress && (
        <InputGroup
          w={"100%"}
          startElement={
            // Show emoji button only on desktop version
            isDesktop && (
              <EmojiButton
                setValue={setValue}
                getValues={getValues}
                ref={inputRef}
              />
            )
          }
          endElement={
            isLoading || isMessagesLoading ? (
              <Spinner />
            ) : (
              <IoMdSend
                // Set send icon color when input value exist
                color={isMessageValueExists ? "white" : ""}
                size={"1.5rem"}
                onClick={handleSubmit(onSubmit)}
              />
            )
          }
        >
          <Input
            type="text"
            autoComplete="off"
            disabled={isLoading || isMessagesLoading}
            borderColor={"primary"}
            borderRadius={"1rem"}
            placeholder="Send a message..."
            size={"xl"}
            autoFocus
            {...rest}
            ref={(el) => {
              inputRef.current = el;
              registerRef(el);
            }}
          />
        </InputGroup>
      )}
      <VoiceButton
        setIsRecordingInProgress={setIsRecordingInProgress}
        sendMessage={sendMessage}
      />
    </Flex>
  );
}
