import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { useEffect, useRef, forwardRef } from "react";
import { extractTime } from "../../../utils/extractTime";
import { useUpdateMessage } from "../../../hooks/useUpdateMessage";
import { IoCheckmarkOutline, IoCheckmarkDoneOutline } from "react-icons/io5";
import {
  useVoiceVisualizer,
  VoiceVisualizer,
} from "@docucare/react-voice-visualizer";
import { convertBase64ToBlob } from "../../../utils/base64converter";
import { IoPlay, IoPauseOutline } from "react-icons/io5";
import MessageContextMenu from "../MessageContextMenu";
import { useContextMenu } from "../../../hooks/useContextMenu";

type MessageProps = {
  text: string;
  contentType: string;
  actor: "sender" | "receiver";
  time: Date;
  isRead: boolean;
  messageId: string;
  // populated replied message (optional)
  repliedTo?: {
    _id: string;
    message: string;
    contentType: string;
    senderId: string;
    createdAt: Date;
  } | null;
  onReply?: (payload: { id: string; preview: string | null }) => void;
  onReplyClick?: (repliedToMessageId: string) => void;
};

export const Message = forwardRef<HTMLDivElement, MessageProps>(
  (
    {
      text,
      contentType,
      actor,
      time,
      messageId,
      isRead,
      repliedTo,
      onReply,
      onReplyClick,
    },
    ref
  ) => {
    const { updateMessage } = useUpdateMessage();
    const messageRef = useRef<HTMLDivElement>(null);

    // Update the message as read when it's in the viewport
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && actor === "receiver" && !isRead) {
            updateMessage(messageId);
          }
        },
        { threshold: 1.0 }
      );

      if (messageRef.current) {
        observer.observe(messageRef.current);
      }

      return () => observer.disconnect();
    }, [actor, isRead, messageId, updateMessage]);

    // Initialize the voice visualizer controls
    const voiceVisualizeControls = useVoiceVisualizer({
      warnBeforeUnload: false,
    });
    const {
      // ... (Extracted controls and states, if necessary)
      setPreloadedAudioBlob,
      isPausedRecordedAudio,
      togglePauseResume,
    } = voiceVisualizeControls;

    // If the message is an audio message, convert the base64 string back to a Blob
    useEffect(() => {
      if (contentType?.startsWith("audio/")) {
        const blob = convertBase64ToBlob(text, contentType);
        setPreloadedAudioBlob(blob);
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text, contentType]);

    // Helper to scroll to replied message
    const handleJumpToOriginal = () => {
      if (onReplyClick && repliedTo) {
        onReplyClick(repliedTo._id);
      }
    };

    // Custom context menu hook
    const {
      menu,
      openContextMenu,
      touchStartContextMenu,
      touchEndContextMenu,
      closeContextMenu,
    } = useContextMenu();

    return (
      <Flex
        onContextMenu={openContextMenu}
        onTouchStart={touchStartContextMenu}
        onTouchMove={touchEndContextMenu}
        onTouchEnd={touchEndContextMenu}
        userSelect={"none"}
        ref={ref}
        px={4}
        py={1}
        my={1}
        className={actor === "sender" ? "glassmorphism" : "glassmorphismChat"}
        borderRadius="lg"
        w="fit-content"
        maxW={"80%"}
        wordBreak={"break-word"}
        alignSelf={actor === "sender" ? "flex-end" : "flex-start"}
        position={"relative"}
      >
        <Grid
          ref={messageRef}
          id={`msg-${messageId}`}
          templateColumns={"auto auto"}
          alignItems={"end"}
          gap={2}
        >
          {/* Replied message preview */}
          {repliedTo && (
            <Box
              bg={"gray.700"}
              px={3}
              py={2}
              borderRadius="md"
              maxW="full"
              mb={2}
              cursor="pointer"
              onClick={handleJumpToOriginal}
              title="Jump to original message"
            >
              <Text fontSize="sm" color="gray.300" truncate>
                {repliedTo.contentType?.startsWith("audio/")
                  ? "Audio message"
                  : repliedTo.message ?? "Message"}
              </Text>
            </Box>
          )}

          {contentType === "text" || contentType === undefined ? (
            <Text>{text}</Text>
          ) : (
            <Flex
              alignItems={"center"}
              justifyContent={"center"}
              gap={2}
              cursor={"pointer"}
            >
              <Box p={2} borderRadius={"full"} className="glassmorphismRed">
                {isPausedRecordedAudio ? (
                  <IoPlay onClick={togglePauseResume} />
                ) : (
                  <IoPauseOutline onClick={togglePauseResume} />
                )}
              </Box>
              <VoiceVisualizer
                width={"clamp(150px, 30vw, 300px)"}
                height={"50"}
                controls={voiceVisualizeControls}
                isAudioProcessingTextShown={false}
                isControlPanelShown={false}
                isProgressIndicatorOnHoverShown={false}
              />
            </Flex>
          )}
          <Flex gap={1}>
            <Text color={"gray.500"} lineHeight={"1"}>
              {extractTime(time)}
            </Text>

            <SendedMessageStatus actor={actor} isRead={isRead} />
          </Flex>

          {menu.visible && (
            <MessageContextMenu
              x={menu.x}
              y={menu.y}
              handleMenuClose={closeContextMenu}
              messageId={messageId}
              messageText={
                contentType === "text" || contentType === undefined
                  ? text
                  : null
              }
              actor={actor}
              onReply={onReply}
            />
          )}
        </Grid>
      </Flex>
    );
  }
);

const SendedMessageStatus = ({
  actor,
  isRead,
}: {
  actor: "sender" | "receiver";
  isRead: boolean;
}) => {
  if (actor !== "sender") return null;

  // if (isSendLoading || status === "sending") return <AiOutlineClockCircle />;
  // if (status === "delivered" || status === "sent")
  //   return <IoCheckmarkOutline />;
  if (isRead) return <IoCheckmarkDoneOutline />;
  return <IoCheckmarkOutline />;
};

Message.displayName = "Message";
