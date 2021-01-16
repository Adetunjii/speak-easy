const { Router } = require("express");
const Room = require("../models/room");
const auth = require("../middleware/auth");

const router = Router();

router.post("/createRoom", auth, async (req, res) => {
  try {
    const newRoom = new Room(req.body);
    await newRoom.save();

    res.status(201).send("Successfully created room");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/waitingList", auth, async (req, res) => {
  try {
    const rooms = await Room.find({ isAvailable: true });
    res.status(200).send(rooms);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/getAllRooms", auth, async (req, res) => {
  try {
    const rooms = await Room.find({}).populate("users");

    console.log(rooms);
    res.status(200).send(rooms);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/deleteRoom/:id", auth, async (req, res) => {
  const roomId = req.params.id;
  try {
    const room = Room.findOneAndDelete({ _id: roomId });
    if (!room) {
      res.status(404).send({ error: "Room doesn't exist" });
    }

    res.status(200).send(room);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
