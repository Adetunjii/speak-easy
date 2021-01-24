const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const mongoose = require("./db/mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");
const {
  userRouter,
  bookingRouter,
  roomRouter,
  groupRouter,
  postRouter,
  uploadRouter,
  otpRouter,
  commentRouter,
} = require("./routes");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
  addUserToRoom,
  addUserToGroup,
  addRoom,
  getAllAvailableRooms,
  removeRoom,
} = require("./utils/users");
const router = require("./router");
const Room = require("./models/room");
const User = require("./models/users");
const { handleError } = require("./helpers/errors");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.json());
app.use(cors());
app.use("/api/users", userRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/room", roomRouter);
app.use("/api/group", groupRouter);
app.use("/api/post", postRouter);
app.use("/api/post/comment", commentRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/otp", otpRouter);
app.use((err, req, res, next) => {
  handleError(err, res);
});
app.use(router);

io.origins(["*:*"]);
io.on("connect", (socket) => {
  io.emit("waitingList", {
    rooms: getAllAvailableRooms(),
  });

  console.log("got here");

  socket.on("joinRoom", async ({ roomId, userId }, callback) => {
    const user = await addUserToRoom({ roomId, userId });

    console.log(user);

    const currentUser = await User.findById(user.userId);
    console.log("currentUser is: ", currentUser);
    if (!currentUser) {
      console.log("user doesn't exist");
      return;
    }
    socket.join(user.roomId);
    console.log("user has joined");

    socket.emit("message", {
      user: "admin",
      text: `${user.name}, welcome to room ${user.room}.`,
    });

    socket.emit("userData", {
      user: user.userId
    })

    socket.broadcast.to(user.roomId).emit("adminMessage", {
      user: "admin",
      text: `${currentUser.username} has joined!`,
    });
  });

  socket.on("joinGroup", async ({ groupId, userID }, callback) => {
    const { error, userId } = await addUserToGroup({ groupId, userID });

    console.log("error is:", error);
    console.log("user is: ", userId);

    if (error) return callback(error);
    const currentUser = User.findById(userId);
    if (!currentUser) {
      return callback("User doesn't exist");
    }
    socket.join(groupId);

    socket.emit("message", {
      user: "admin",
      text: `${user.name}, welcome to room ${user.room}.`,
    });

    socket.broadcast.to(groupId).emit("message", {
      user: "admin",
      text: `${currentUser.username} has joined!`,
    });
  });

  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    socket.join(user.room);

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

  socket.on("sendMessageToRoom", ({ roomId, userId, message }, callback) => {
    io.to(roomId).emit("message", {
      room: roomId,
      user: userId,
      text: message,
    });
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


