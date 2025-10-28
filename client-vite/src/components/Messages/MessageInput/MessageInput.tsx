import { Flex, Input, Spinner } from "@chakra-ui/react";
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

export default function MessageInput({
  messageReceiver,
}: {
  messageReceiver: string;
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
  const { data: messagesList, isLoading: isMessagesLoading } =
    useGetMessages(messageReceiver);
  const { followConversation } = useFollowConversation();

  const onSubmit = ({ message }: { message: string }) => {
    // Send only if message exist
    if (message) {
      sendMessage({ message, contentType: "text" });
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
