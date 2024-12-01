import { useEffect, useState } from "react";
import socketService, { socket } from "./socket";

socket.on("error", (error) => {
  console.log("socket error ", error);
});

export const useSocket = (roomId) => {
  const [studentCount, setStudentCount] = useState(0);
  useEffect(() => {
    socket.on("student-count", (count) => {
      console.log(count);
      debugger;
      setStudentCount(count);
    });
    if (roomId) {
      socketService.joinRoom(roomId);
    }
    return () => {
      socketService.disconnectRoom(roomId);
      socket.off(studentCount);
    };
  }, [roomId]);

  const sendCodeUpdate = (code) => {
    if (roomId) {
      socketService.codeUpdate(roomId, code);
    }
  };
  return {
    socket,
    sendCodeUpdate,
    studentCount,
    isConnected: socket.connected,
    socketId: socket.id,
  };
};
