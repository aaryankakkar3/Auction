import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!socket) {
      console.log("🔧 Creating new Socket.IO connection...");
      socket = io({
        path: "/api/socket",
        transports: ["polling"], // Use polling only for Next.js compatibility
        upgrade: false, // Disable WebSocket upgrade
      });

      socket.on("connect", () => {
        console.log("🔌 Connected to Socket.IO server");
        console.log("🔌 Socket ID:", socket?.id);
        setIsConnected(true);
      });

      socket.on("disconnect", () => {
        console.log("❌ Disconnected from Socket.IO server");
        setIsConnected(false);
      });

      socket.on("connect_error", (error) => {
        console.error("❌ Socket.IO connection error:", error);
        setIsConnected(false);
      });
    } else {
      console.log("🔄 Reusing existing Socket.IO connection");
      setIsConnected(socket.connected);

      // Set up listeners for this component instance too
      socket.on("connect", () => {
        setIsConnected(true);
      });

      socket.on("disconnect", () => {
        setIsConnected(false);
      });

      socket.on("connect_error", () => {
        setIsConnected(false);
      });
    }

    return () => {
      // Don't close the socket here, let it be shared across components
    };
  }, []);

  return { socket, isConnected };
};
