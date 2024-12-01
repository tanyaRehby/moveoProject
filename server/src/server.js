const express = require("express");
const mongoose = require("mongoose");
const app = express();
const codeBlockRoute = require("./routes/codeBlock.rotes.js");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

const rooms = new Map(); // stores the rooms and their associated data

const activeConnections = new Map();

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

const io = new Server(server, {
  allowEIO3: true,
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use("/api/codeblocks", codeBlockRoute);

io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  socket.on("join room", (roomId) => {
    if (activeConnections.has(socket.id)) {
      console.log("User already in a room");
      return;
    }

    socket.join(roomId);
    activeConnections.set(socket.id, roomId); // store connection to room
    //create a new room if it doesnt exist
    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        mentor: socket.id,
        students: new Set(),
        code: "",
      });
      socket.emit("role-assign", "mentor"); // assign mentor role
      console.log(`Created new room ${roomId} - Mentor: ${socket.id}`);
    } else {
      //add student to the room if it already exists
      const room = rooms.get(roomId);
      if (socket.id !== room.mentor) {
        room.students.add(socket.id); // adding student
        socket.emit("role-assign", "student"); // assign student role

        const studentCount = room.students.size;
        io.to(roomId).emit("student-count", studentCount); // send student count update
        console.log(
          `Added student ${socket.id} to room ${roomId}, count: ${studentCount}`
        );
      }
    }
  });

  socket.on("code-change", ({ roomId, newcode }) => {
    const room = rooms.get(roomId);
    if (room) {
      room.code = newcode;

      socket.to(roomId).emit("code-update", newcode); // emit updated code to room
      console.log(`Code updated in room ${roomId}`);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    const roomId = activeConnections.get(socket.id);
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room) return;
    /// handle mentor disconnection
    if (socket.id === room.mentor) {
      io.to(roomId).emit("mentor-disconnected"); // notify that the mentor has disconnected
      rooms.delete(roomId); // remove room from rooms map
      console.log(`Mentor ${socket.id} disconnected, room ${roomId} closed`);
    } else if (room.students.has(socket.id)) {
      room.students.delete(socket.id); // remove student from room
      const newCount = room.students.size;
      io.to(roomId).emit("student-count", newCount); // update student count
      console.log(
        `Student ${socket.id} left room ${roomId}, new count: ${newCount}`
      );
    }

    activeConnections.delete(socket.id);
  });

  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });
});

const PORT = 4000; //the port the server will listen
mongoose
  .connect("mongodb://localhost:27017/codeblocks") // establishing connection to mongodb
  .then(() => console.log("MongoDB connected successfully")) //success message if mongodb connection is established
  .catch((error) => console.error("MongoDB connection error:", error)); // error if mongodb connection is fails

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); //message when the server starts successfully
});
