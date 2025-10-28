"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthContext } from "./AuthContext";

// Socket Context
interface SocketContextI {
  socket: Socket | null;
  onlineUsers: string[];
}

// Create the context
const SocketContext = createContext<SocketContextI>({
  socket: null,
  onlineUsers: [],
});

// Custom hook to use the context
export const useSocketContext = () => {
  const { socket, onlineUsers } = useContext(SocketContext);
  return { socket, onlineUsers };
};

// Provider to wrap the app in
export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { authUser } = useAuthContext();

  // Effect to connect to the socket
  useEffect(() => {
    if (authUser) {
      // Connect to the socket
      // http://localhost:8000
      // https://74qzhq16-8000.euw.devtunnels.ms
      const socket = io("https://74qzhq16-8000.euw.devtunnels.ms", {
        withCredentials: true,
        transports: ["websocket"],
        query: {
          userId: authUser._id,
        },
      });

      // Set the socket
      setSocket(socket);

      // Listen for online users
      socket.on("getOnlineUsers", (userIds: string[]) => {
        setOnlineUsers(userIds);
      });

      // Close the socket on unmount
      return () => {
        socket.close();
      };
    } else {
      // Close the socket if the user is not authenticated
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
