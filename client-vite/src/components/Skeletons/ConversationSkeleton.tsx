import { HStack, Stack } from "@chakra-ui/react";
import { Skeleton, SkeletonCircle } from "../../components/ui/skeleton";

export default function ConversationSkeleton() {
  const skeletonCSS = {
    "--start-color": "colors.skeleton",
    "--end-color": "colors.skeleton.100",
  };
  return (
    <HStack gap={2} p={2}>
      <SkeletonCircle variant="shine" css={skeletonCSS} size="10" />
      <Stack flex="1">
        <Skeleton variant="shine" css={skeletonCSS} height="5" width="60%" />
        <Skeleton variant="shine" css={skeletonCSS} height="3" width="40%" />
      </Stack>
    </HStack>
  );
}
