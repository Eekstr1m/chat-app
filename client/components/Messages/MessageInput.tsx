"use client";
import { Input, Spinner } from "@chakra-ui/react";
import { InputGroup } from "../ui/input-group";
import { IoMdSend } from "react-icons/io";
import { useForm } from "react-hook-form";
import { useSendMessage } from "@/hooks/useSendMessage";
import { useEffect } from "react";
import { useGetMessages } from "@/hooks/useGetMessages";

export default function MessageInput({
  messageReceiver,
}: {
  messageReceiver: string;
}) {
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    // formState: { errors },
  } = useForm<{ message: string }>();
  const { sendMessage, isLoading } = useSendMessage(messageReceiver);
  const { isLoading: isMessagesLoading } = useGetMessages(messageReceiver);

  const onSubmit = ({ message }: { message: string }) => {
    sendMessage(message);
    reset();
  };
  useEffect(() => {
    if (!isLoading) {
      setFocus("message");
    }
  }, [isLoading, setFocus]);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputGroup
        w={"100%"}
        mt={4}
        endElement={
          isLoading || isMessagesLoading ? (
            <Spinner />
          ) : (
            <IoMdSend size={"1.5rem"} />
          )
        }
      >
        <Input
          autoComplete="off"
          disabled={isLoading || isMessagesLoading}
          borderColor={"primary"}
          borderRadius={"1rem"}
          placeholder="Send a message..."
          size={"xl"}
          autoFocus
          {...register("message")}
        />
      </InputGroup>
    </form>
  );
}
