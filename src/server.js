const express = require("express");
const http = require("http");
const mongoose = require("./db/mongoose");
const dotenv = require("dotenv").config();
const socketio = require("socket.io");
const cors = require("cors");
const { userRouter } = require("./routes");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/users");

const app = express();
app.use(express.json());
app.use(cors({ origin: true }));
const server = http.createServer(app);
const io = socketio(server);

//routes
app.use("/api", userRouter);

//create a socket connection
io.on("connect", (socket) => {
  //listen for a join event from the client
  socket.on("join", ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });
    if (error) return callback(error);

    //allow user to join room
    socket.join(user.room);

    //sends a message to every one saying the user just joined
    socket.emit("message", {
      user: "Admin",
      text: `${user.name}, Just joined`,
    });
    socket.broadcast
      .to(user.room)
      .emit("message", { user: "Admin", text: `${user.name} has joined!!` });

    //get users in a room
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
    callback();
  });

  //listens to the sendMessage event from the client and emits the message too all participants in the chat room
  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit("message", { user: user.name, text: message });
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("message", {
        user: "Admin",
        text: `${user.name} has left. `,
      });
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

//server instantiation
const port = process.env.PORT || 3000;
server.listen(port, () => console.log("Server is running on port", port));
