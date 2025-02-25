import Messages from "@/components/Messages/Messages";
import SideBar from "@/components/SideBar/SideBar";
import { GridItem } from "@chakra-ui/react";

export default async function Page({
  params,
}: {
  params: Promise<{ messageReceiver: string }>;
}) {
  const messageReceiver = (await params).messageReceiver;

  return (
    <>
      <GridItem area="sidebar">
        <SideBar messageReceiver={messageReceiver} />
      </GridItem>
      <GridItem area="main">
        <Messages messageReceiver={messageReceiver} />
      </GridItem>
    </>
  );
}
