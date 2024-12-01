//importing React hooks for managing state and side effects
import { useEffect, useState } from "react";
//importing the socket service and socket instance
import socketService from "./socket";
//handling socket errors globally

//custom hook to manage socket connections and interactions
export const useSocket = (roomId) => {
  const [studentCount, setStudentCount] = useState(0);
  const [role, setRole] = useState(null);
  const [code, setCode] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // init the socket connection
    const newSocket = socketService.init();
    setSocket(newSocket);

    //if roomId is provided then join the specific room
    if (roomId) {
      socketService.joinRoom(roomId);
    }
    newSocket.on("student-count", (count) => {
      console.log(count);
      setStudentCount(count);
    });
    newSocket.on("role-assign", (assignRole) => {
      setRole(assignRole);
    });
    newSocket.on("code-update", (updateCode) => {
      console.log("update code", updateCode);
      setCode(updateCode);
    });

    if (roomId) {
      socketService.joinRoom(roomId);
    }
    //disconnect from the room and socket connection when no longer needed
    return () => {
      if (roomId) {
        socketService.disconnectRoom(roomId); //disconnect from the room
      }
      if (newSocket) {
        newSocket.disconnect(); //disconnect from the socket connection
      }
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
    code,
    role,
    isConnected: socket?.connected,
    socketId: socket?.id,
  };
};
