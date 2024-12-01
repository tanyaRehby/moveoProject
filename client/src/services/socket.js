import { connect, io } from "socket.io-client";
const SOCKET_URL = "http://localhost:4000";
export const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  transports: ["websocket", "polling"],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 10000,
});
const socketService = {
  init() {
    socket.on("connect", () => {
      console.log("connection succesfully!");
    });
    socket.on("connect_error", (error) => {
      console.error("socket connction error", error);
    });
    socket.on("disconnect", (reason) => {
      console.log("socket disconnect ", reason);
    });
    socket.on("reconnect", (attemptnumber) => {
      console.log("socket reconect number ", attemptnumber);
    });
    return socket;
  },
  joinRoom(roomId) {
    if (!socket.connect) {
      socket.connect();
    }
    socket.emit("join-room", roomId);
  },
  disconnectRoom(roomId) {
    socket.emit("disconnect-room", roomId);
  },
  codeUpdate(roomId, code) {
    socket.emit("code-update", { roomId, code });
  },
  disconnect() {
    if (socket.connect) {
      socket.disconnect();
    }
  },
  on(event, callback) {
    socket.on(event, callback);
  },
  off(event, callback) {
    socket.off(event, callback);
  },
  getStatus() {
    return { connected: socket.connected, id: socket.id };
  },
};
socketService.init();
export default socketService;
