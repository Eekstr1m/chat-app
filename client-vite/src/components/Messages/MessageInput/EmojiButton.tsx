import { Popover, Portal } from "@chakra-ui/react";
import { UseFormGetValues, UseFormSetValue } from "react-hook-form";
import { useEffect, useState } from "react";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import Picker, { EmojiClickData } from "emoji-picker-react";

export default function EmojiButton({
  setValue,
  getValues,
  ref,
}: {
  setValue: UseFormSetValue<{
    message: string;
  }>;
  getValues: UseFormGetValues<{
    message: string;
  }>;
  ref: React.RefObject<HTMLInputElement | null>;
}) {
  // const [isOpen, setIsOpen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<number>(0);

  const onEmojiClick = (emojiObject: EmojiClickData) => {
    // Get value from message input field
    const messageValue = getValues("message");
    // Get selected emoji
    const emoji = emojiObject.emoji;

    // Split message to keep cursor position
    const start = messageValue.substring(0, ref.current?.selectionStart ?? 0);
    const end = messageValue.substring(ref.current?.selectionStart ?? 0);
    const text = start + emoji + end;

    setValue("message", text);
    // Saving cursor position after added emoji
    setCursorPosition(start.length + emoji.length);
  };

  useEffect(() => {
    if (ref.current) {
      // Setting cursor position to the last saved
      ref.current.selectionEnd = cursorPosition;
    }
  }, [ref, cursorPosition]);

  return (
    <Popover.Root
      // open={isOpen}
      onOpenChange={() => ref.current?.focus()}
      positioning={{ sameWidth: true }}
    >
      <Popover.Trigger asChild>
        <MdOutlineEmojiEmotions
          cursor={"pointer"}
          // onClick={() => setIsOpen(!isOpen)}
          size={"1.5rem"}
        />
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content>
            <Picker
              width={"100%"}
              lazyLoadEmojis
              autoFocusSearch={false}
              searchDisabled
              previewConfig={{ showPreview: false }}
              onEmojiClick={(emojiObject) => onEmojiClick(emojiObject)}
            />
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}
