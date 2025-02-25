"use client";
import MessageStart from "../../components/Messages/MessageStart";
import { useAuthContext } from "../../context/AuthContext";
import { handleAuthRedirect } from "../../utils/auth";
import { useRouter } from "next/navigation";
import { GridItem } from "@chakra-ui/react";
import { useEffect } from "react";
import SideBar from "../../components/SideBar/SideBar";

export default function Page() {
  const { authUser } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    handleAuthRedirect(authUser, router);
  }, [authUser, router]);

  return (
    <>
      <GridItem area="sidebar">
        <SideBar messageReceiver={""} />
      </GridItem>
      <GridItem area="main">
        <MessageStart />
      </GridItem>
    </>
  );
}
