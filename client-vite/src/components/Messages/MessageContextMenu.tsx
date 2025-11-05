import { Box, Flex, Portal, Text } from "@chakra-ui/react";
import { useRef } from "react";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import { toaster } from "../ui/toaster";
import { useDeleteMessage } from "../../hooks/useDeleteMessage";

export default function MessageContextMenu({
  x,
  y,
  handleMenuClose,
  messageId,
  messageText,
  actor,
  onReply,
}: {
  x: number;
  y: number;
  handleMenuClose: () => void;
  messageId: string;
  messageText: string | null;
  actor: "sender" | "receiver";
  onReply?: (payload: { id: string; preview: string | null }) => void;
}) {
  const contextRef = useRef<HTMLElement>(null);
  useOnClickOutside(contextRef, handleMenuClose);
  const { deleteMessage } = useDeleteMessage(messageId);

  // Handlers for menu actions
  const handleEdit = () => {
    handleMenuClose();
    console.log("Edit message: " + messageId);
  };

  const handleDelete = () => {
    deleteMessage();
    handleMenuClose();
    // Implement delete logic here
    console.log("Delete message: " + messageId);
  };

  const handleCopy = () => {
    handleMenuClose();
    if (messageText) {
      navigator.clipboard.writeText(messageText);
      toaster.create({
        description: "Message copied to clipboard",
        type: "info",
      });
    }
  };

  const handleReply = () => {
    handleMenuClose();
    onReply?.({ id: messageId, preview: messageText ?? null });
  };

  return (
    <Portal>
      <Box
        ref={contextRef}
        position="absolute"
        left={x}
        top={y}
        zIndex={9999}
        className="glassmorphismChat"
        boxShadow="md"
        borderRadius="md"
        minW="120px"
        onMouseLeave={handleMenuClose}
      >
        <Flex direction="column" gap={2}>
          {/* Reply available for all messages */}
          <TextMenuItem onClick={handleReply}>Reply</TextMenuItem>
          {actor === "sender" && messageText && (
            <TextMenuItem onClick={handleEdit}>Edit</TextMenuItem>
          )}
          {actor === "sender" && (
            <TextMenuItem onClick={handleDelete}>Delete</TextMenuItem>
          )}
          {messageText && (
            <TextMenuItem onClick={handleCopy}>Copy</TextMenuItem>
          )}
        </Flex>
      </Box>
    </Portal>
  );
}

const TextMenuItem = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <Text
    px={2}
    py={1}
    cursor="pointer"
    transition={"background-color 0.2s linear"}
    _hover={{ backgroundColor: "rgba(156, 58, 81, 0.51)" }}
    onClick={onClick}
  >
    {children}
  </Text>
);
