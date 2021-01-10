const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const mongoose = require("./db/mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");
const { userRouter } = require("./routes");

const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/users");

const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.json());
app.use(cors());
app.use("/api", userRouter);
app.use(router);

io.origins(["*:*"]);
io.on("connect", (socket) => {
  console.log("got here");
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    socket.join(user.room);

    console.log(`${user.name} joined ${user.room}`);
    socket.emit("message", {
      user: "admin",
      text: `${user.name}, welcome to room ${user.room}.`,
    });

    console.log("userData is:", {
      id: socket.id,
      user: user.name,
      room: user.room,
    });

    socket.emit("userData", {
      id: socket.id,
      name: user.name,
      room: user.room,
    });
    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", text: `${user.name} has joined!` });

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    // callback();
  });

  socket.on("sendMessage", ({ userData, message }, callback) => {
    console.log(socket.id);
    console.log("user ==>", userData);
    console.log(message);
    const allUsers = getUsersInRoom(userData.room);
    console.log("all users: ", allUsers);
    try {
      if (userData) {
        io.to(userData.room).emit("message", {
          user: userData.name,
          text: message,
          userData: userData,
        });
        callback();
      } else {
        console.log("no user here");
      }
    } catch (error) {
      console.log("sendmessageError", error);
    }
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("message", {
        user: "Admin",
        text: `${user.name} has left.`,
      });
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server has started on ${PORT}`));
