const { Router } = require("express");
const Room = require("../models/room");
const User = require("../models/users");
const auth = require("../middleware/auth");
const { ErrorHandler } = require("../helpers/errors");

const router = Router();

router.post("/createRoom", auth, async (req, res) => {
  try {
    const newRoom = new Room(req.body);
    const room = await newRoom.save();
    res.status(201).send({
      status: true,
      message: "successfully created",
      data: room,
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/waitingList", auth, async (req, res, next) => {
  try {
    const rooms = await Room.find({ isAvailable: true }).populate("users");
    res.status(200).send({
      status: true,
      message: "successfully fetched...",
      data: rooms,
    });
    next();
  } catch (error) {
    next(error);
  }
});

router.get("/getUsersInRoom/:roomId", async (req, res, next) => {
  try {
    const roomId = req.params.roomId;

    if (!roomId) {
      throw new ErrorHandler(400, "Invalid room id");
    }

    const users = await Room.findById(roomId).select("users").populate("users");

    res.status(200).send({
      status: true,
      message: "successfully fetched...",
      data: users,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/getAllRooms", auth, async (req, res, next) => {
  try {
    const rooms = await Room.find({}).populate("users");

    console.log(rooms);
    res.status(200).send(rooms);
    next();
  } catch (error) {
    next(error);
  }
});

router.patch("/updateRoom/:roomId", auth, async (req, res, next) => {
  const updates = Object.keys(req.body);
  const roomId = req.params.roomId;
  const allowedUpdates = ["roomName", "users", "isAvailable"];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  try {
    if (!isValidOperation) {
      throw new ErrorHandler(400, "invalid update");
    }

    const room = await Room.findById(roomId);

    if (!room) {
      throw new ErrorHandler(404, "Room not found");
    }

    updates.forEach((update) => (room[update] = req.body[update]));

    await room.save();
    res.status(200).send({
      status: true,
      message: "successfully updated",
      data: room,
    });
    next();
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
});

router.delete("/deleteRoom/:roomId", auth, async (req, res, next) => {
  const roomId = req.params.roomId;
  try {
    const room = await Room.findByIdAndDelete(roomId);
    if (!room) {
      throw new ErrorHandler(404, "Room doesn't exist");
    }

    res.status(200).send(room);
    next();
  } catch (error) {
    error.statusCode = 404;
    next(error);
  }
});

module.exports = router;
