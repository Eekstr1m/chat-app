import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import { UserI } from "../interfaces/UsersInterfaces";
import { useQueryClient } from "@tanstack/react-query";

export default function useListenLastOnline() {
  const { socket } = useSocketContext();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    // Handler function to update user data in cache when they go offline
    const handleUserOffline = (user: UserI) => {
      queryClient.setQueryData(["userById", user._id], user);
    };

    socket.on("userOffline", handleUserOffline);

    return () => {
      socket.off("userOffline", handleUserOffline);
    };
  }, [socket, queryClient]);
}
