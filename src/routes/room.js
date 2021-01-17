const { Router } = require("express");
const Room = require("../models/room");
const auth = require("../middleware/auth");
const { ErrorHandler } = require("../helpers/errors");

const router = Router();

router.post("/createRoom", auth, async (req, res) => {
  try {
    const newRoom = new Room(req.body);
    console.log(newRoom);
    const room = await newRoom.save();
    console.log(room);
    res.status(201).send("Successfully created room");
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/waitingList", auth, async (req, res, next) => {
  try {
    const rooms = await Room.find({ isAvailable: true }).populate("users");
    res.status(200).send(rooms);
    next();
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

router.delete("/deleteRoom/:id", auth, async (req, res, next) => {
  const roomId = req.params.id;
  try {
    const room = Room.findOneAndDelete({ _id: roomId });
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
