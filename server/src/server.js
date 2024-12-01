const express = require("express");
const mongoose = require("mongoose");
const app = express(); //instance of the express library to create the backend server
const codeBlockRoute = require("./routes/codeBlock.rotes.js");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
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
  allowRequest: (req, callback) => {
    const isOriginalid = req.headers.origin === "http://localhost:3000";
    callback(null, isOriginalid);
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use("/api/codeblocks", codeBlockRoute);

io.on("connection", (socket) => {
  console.log("user conncted", socket.id);
  const rooms = new Map();
  socket.on("join room", (roomId) => {
    socket.join(roomId);
    if (!rooms.has(roomId)) {
      rooms.set(roomId, { mentor: socket.id, students: new Set(), code: "" });
      socket.emit("role-assign", "mentor");
    } else {
      rooms.get(roomId).students.add(socket.id);
      socket.emit("role-assign", "student");
      const curentCode = rooms.get(roomId).code;
      if (curentCode) {
        socket.emit("code-update", curentCode);
      }
    }
    io.to(roomId).emit("student-count", rooms.get(roomId).students.size);
  });
  socket.on("code-change", ({ roomId, newcode }) => {
    const room = rooms.get(roomId);
    if (room) {
      room.code = newcode;
      socket.to(roomId).emit("code-update", newcode);
    }
  });
  socket.on("disconnect-room", () => {
    for (const roomId of rooms) {
      console.log(rooms);
    }
  });
});

const PORT = 4000;
mongoose
  .connect("mongodb://localhost:27017/codeblocks")
  .then(() => console.log("mongoDB connected"))
  .catch((error) => console.error("mongoDB connection error: ", error));

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
