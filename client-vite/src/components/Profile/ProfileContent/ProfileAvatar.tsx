import {
  Box,
  Button,
  Dialog,
  FileUpload,
  FileUploadFileAcceptDetails,
  FileUploadFileRejectDetails,
  Image,
  Portal,
  Spinner,
  createOverlay,
} from "@chakra-ui/react";
import { UserI } from "../../../interfaces/UsersInterfaces";
import { useUpdateUserAvatar } from "../../../hooks/useUpdateUserAvatar";
import { LuFileImage } from "react-icons/lu";
import { toaster } from "../../ui/toaster";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
  type Crop,
} from "react-image-crop";
import { useRef, useState } from "react";
import setCanvasPreview from "../../../utils/setCanvasPreview";
import { convertBase64ToBlob } from "../../../utils/base64converter";
import { useAuthContext } from "../../../context/AuthContext";

export default function ProfileAvatar({
  user,
  isUserDataLoading,
  profileId,
}: {
  user: UserI;
  isUserDataLoading: boolean;
  profileId: string;
}) {
  const { isLoading } = useUpdateUserAvatar(profileId);
  const { authUser } = useAuthContext();

  return (
    <Box
      className="profile-avatar"
      flexShrink={0}
      position={"relative"}
      role="group"
    >
      <Image
        src={user.avatar}
        alt={user.userName}
        boxSize={{ base: "180px", md: "260px" }}
        borderRadius="full"
        fit="cover"
      />

      {(authUser?.userName === profileId || authUser?._id === profileId) && (
        <UpdateAvatar
          isLoading={isLoading}
          isUserDataLoading={isUserDataLoading}
          profileId={profileId}
        />
      )}

      <dialog.Viewport />
    </Box>
  );
}

function UpdateAvatar({
  isLoading,
  isUserDataLoading,
  profileId,
}: {
  isLoading: boolean;
  isUserDataLoading: boolean;
  profileId: string;
}) {
  return (
    <Box
      className="transparentGlass"
      borderRadius={"full"}
      position="absolute"
      width={"100%"}
      height={"100%"}
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
      display={"grid"}
      placeItems={"center"}
      opacity={isLoading || isUserDataLoading ? 1 : 0}
      transition={"all 0.3s linear"}
      _hover={{
        opacity: 1,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
      }}
    >
      {isLoading || isUserDataLoading ? (
        <Spinner size={"lg"} />
      ) : (
        <FileUploadButton profileId={profileId} />
      )}
    </Box>
  );
}

function FileUploadButton({ profileId }: { profileId: string }) {
  const [uploadKey, setUploadKey] = useState(0);

  const onFileAcceptHandler = async (
    uploadedFiles: FileUploadFileAcceptDetails
  ) => {
    const file = uploadedFiles.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const imageUrl = reader.result?.toString() || "";

      // Allow the same file to be selected again
      setUploadKey((k) => k + 1);

      // Open dialog for image cropping
      dialog.open("a", {
        imgSrc: imageUrl,
        contentType: file.type,
        profileId: profileId,
      });
    });

    reader.readAsDataURL(file);
  };

  const onFileRejectHandler = (file: FileUploadFileRejectDetails) => {
    if (file.files.length > 0) {
      toaster.create({ description: "Image size exceeds 5MB", type: "error" });
    }
  };

  return (
    <Box>
      <FileUpload.Root
        key={uploadKey}
        maxFiles={1}
        maxFileSize={5242880}
        onFileAccept={onFileAcceptHandler}
        onFileReject={onFileRejectHandler}
        accept="image/png, image/jpeg, image/jpg, image/webp"
      >
        <FileUpload.HiddenInput />
        <FileUpload.Trigger asChild>
          <Button
            size="md"
            className="glassmorphismChat"
            color="white"
            variant="solid"
            transition={"all 0.3s ease"}
            _hover={{ transform: "scale(1.1)" }}
            zIndex={10}
          >
            <LuFileImage /> Upload Image
          </Button>
        </FileUpload.Trigger>
      </FileUpload.Root>
    </Box>
  );
}

interface DialogProps {
  imgSrc: string;
  contentType: string;
  profileId: string;
}

const dialog = createOverlay<DialogProps>((props) => {
  const { onOpenChange, contentType, profileId, imgSrc, ...rest } = props;
  const { updateUserAvatar } = useUpdateUserAvatar(profileId);
  const imageRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const [crop, setCrop] = useState<Crop>();

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;

    const crop = makeAspectCrop(
      {
        unit: "%",
        width: 100,
      },
      1,
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  };

  const onCropImage = () => {
    if (!crop || !imageRef.current || !previewCanvasRef.current) return;

    // Convert crop to pixel
    const pixelCrop = convertToPixelCrop(
      crop,
      imageRef.current.naturalWidth,
      imageRef.current.naturalHeight
    );

    // Set canvas for cropped image
    setCanvasPreview(imageRef.current, previewCanvasRef.current, pixelCrop);

    // Converting canvas to blob
    const dataUrl = previewCanvasRef.current?.toDataURL();
    const blob = convertBase64ToBlob(dataUrl, contentType);

    if (!blob) {
      console.error("Failed to create blob from canvas!");
      return;
    }

    // Sending new avatar to server
    const fd = new FormData();
    fd.append("avatar", blob);
    updateUserAvatar(fd);

    // Closing dialog
    onOpenChange?.({ open: false });
  };

  return (
    <Dialog.Root {...rest}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Crop the image</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body spaceY="4">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                aspect={1}
                circularCrop
                keepSelection
              >
                <img
                  ref={imageRef}
                  src={imgSrc}
                  crossOrigin="anonymous"
                  onLoad={onImageLoad}
                />
              </ReactCrop>
              {crop && (
                <canvas
                  ref={previewCanvasRef}
                  className="mt-4"
                  style={{
                    display: "none",
                    border: "1px solid black",
                    objectFit: "contain",
                    width: 150,
                    height: 150,
                  }}
                />
              )}
              <Button
                size="md"
                className="glassmorphismChat"
                color="white"
                variant="solid"
                transition={"all 0.3s ease"}
                _hover={{ transform: "scale(1.1)" }}
                zIndex={10}
                onClick={onCropImage}
              >
                Crop Image
              </Button>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
});
