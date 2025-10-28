import { useSocketContext } from "../context/SocketContext";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import { UserI } from "../interfaces/UsersInterfaces";

export const useListenFirstMessage = () => {
  const { socket } = useSocketContext();
  const queryClient = useQueryClient();
  const { authUser, setAuthUser } = useAuthContext();

  useEffect(() => {
    if (!socket || !authUser) return;

    const handleFirstMessage = (user: UserI) => {
      // Save updated user data to localStorage and update context
      localStorage.setItem("authUser", JSON.stringify(user));
      setAuthUser(user);
      // Invalidate conversations cache
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    };

    socket.on("firstMessage", handleFirstMessage);

    return () => {
      socket.off("firstMessage");
    };
  }, [socket, queryClient, authUser, setAuthUser]);
};
