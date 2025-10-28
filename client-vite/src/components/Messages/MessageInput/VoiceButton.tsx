import { useEffect } from "react";
import {
  useVoiceVisualizer,
  VoiceVisualizer,
} from "@docucare/react-voice-visualizer";
import { Box, Flex, Spinner } from "@chakra-ui/react";
import { PiMicrophone } from "react-icons/pi";
import { BsStopCircle } from "react-icons/bs";
import { convertBlobToBase64 } from "../../../utils/base64converter";
import { toaster } from "../../ui/toaster";

export default function VoiceButton({
  setIsRecordingInProgress,
  sendMessage,
}: {
  setIsRecordingInProgress: React.Dispatch<React.SetStateAction<boolean>>;
  sendMessage: (args: { message: string; contentType: string }) => void;
}) {
  // Initialize the recorder controls using the hook
  const recorderControls = useVoiceVisualizer({
    warnBeforeUnload: false,
  });
  const {
    // ... (Extracted controls and states, if necessary)
    startRecording,
    stopRecording,
    clearCanvas,
    isRecordingInProgress,
    formattedRecordingTime,
    isProcessingRecordedAudio,
    recordedBlob,
    error,
  } = recorderControls;

  // Get the recorded audio blob
  useEffect(() => {
    if (!recordedBlob) return;

    // Convert the Blob to a base64 string and send it as a message
    convertBlobToBase64(recordedBlob).then((base64) => {
      sendMessage({ message: base64, contentType: recordedBlob.type });
      clearCanvas();
    });
  }, [recordedBlob, error, sendMessage, clearCanvas]);

  // Get the error when it occurs
  useEffect(() => {
    if (!error) return;

    toaster.create({
      description: error.message || "An error occurred",
      type: "error",
    });
  }, [error]);

  // Set parent value for recording progress
  useEffect(() => {
    setIsRecordingInProgress(isRecordingInProgress);
  }, [isRecordingInProgress, setIsRecordingInProgress]);

  return (
    <Flex
      alignItems={"center"}
      gap={2}
      width={isRecordingInProgress ? "100%" : "fit-content"}
    >
      <Box
        width={isRecordingInProgress ? "100%" : 0}
        className={isRecordingInProgress ? "glassmorphism" : ""}
        position={"relative"}
      >
        {isRecordingInProgress && (
          <Box
            position={"absolute"}
            right={2}
            bottom={1}
            zIndex={1}
            color={"gray.500"}
            lineHeight={"1"}
            fontSize={"0.8rem"}
          >
            {formattedRecordingTime}
          </Box>
        )}
        <VoiceVisualizer
          height={"50"}
          controls={recorderControls}
          isAudioProcessingTextShown={false}
          isControlPanelShown={false}
          isDefaultUIShown={false}
        />
      </Box>

      <Box>
        {isRecordingInProgress ? (
          <BsStopCircle size={"1.5rem"} onClick={stopRecording} />
        ) : isProcessingRecordedAudio ? (
          <Spinner />
        ) : (
          <PiMicrophone size={"1.5rem"} onClick={startRecording} />
        )}
      </Box>
    </Flex>
  );
}
