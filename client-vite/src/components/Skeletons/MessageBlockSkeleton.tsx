import { Stack } from "@chakra-ui/react";
import { Skeleton } from "../ui/skeleton";

export default function MessageBlockSkeleton() {
  return (
    <Stack flex="1" gap={2} px={4} py={1} my={1}>
      <MessageSkeleton width="20%" isAlign />
      <MessageSkeleton width="25%" isAlign />
      <MessageSkeleton width="15%" />
      <MessageSkeleton width="30%" />
      <MessageSkeleton width="25%" isAlign />
      <MessageSkeleton width="15%" />
      <MessageSkeleton width="25%" isAlign />
      <MessageSkeleton width="30%" />
      <MessageSkeleton width="15%" />
    </Stack>
  );
}

function MessageSkeleton({
  isAlign,
  width,
}: {
  isAlign?: boolean;
  width: string;
}) {
  const skeletonCSS = {
    "--start-color": "colors.skeleton",
    "--end-color": "colors.skeleton.100",
  };
  return (
    <Skeleton
      variant="shine"
      css={skeletonCSS}
      height="8"
      width={width}
      alignSelf={isAlign ? "flex-end" : "flex-start"}
    />
  );
}
