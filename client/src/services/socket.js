import io from "socket.io-client";

const SOCKET_URL = "http://localhost:4000";

let socket = null;

export const socketService = {
  init() {
    if (!socket) {
      socket = io(SOCKET_URL, {
        autoConnect: true,
        reconnection: true,
        transports: ["websocket", "polling"],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
      });

      // Connection event handlers
      socket.on("connect", () => {
        console.log("Connection successfully established!", socket.id);
      });

      socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });

      socket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
      });

      socket.on("reconnect", (attemptNumber) => {
        console.log("Socket reconnected, attempt number:", attemptNumber);
      });
    }
    return socket;
  },

  joinRoom(roomId) {
    if (!socket?.connected) {
      socket.connect();
    }
    socket.emit("join room", roomId);
    console.log("Attempting to join room:", roomId);
  },

  disconnectRoom(roomId) {
    socket.emit("leave room", roomId);
    console.log("Leaving room:", roomId);
  },

  codeUpdate(roomId, code) {
    socket.emit("code-change", { roomId, newcode: code });
    console.log("Emitting code update for room:", roomId);
  },

  disconnect() {
    if (socket?.connected) {
      socket.disconnect();
      console.log("Socket manually disconnected");
    }
  },

  on(event, callback) {
    socket.on(event, callback);
  },

  off(event, callback) {
    socket.off(event, callback);
  },
};

export default socketService;
