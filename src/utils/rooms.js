const Room = require("../models/room");

const createRoom = async ({ name, users }) => {
  try {
    if (name !== null) {
      const room = new Room({ name, users });
      await room.save();
    }
  } catch (error) {
    console.log(error);
  }
};

const waitingList = async () => {
  try {
    const availableRooms = Room.find({ isAvailable: true });
    return availableRooms;
  } catch (error) {
    throw new Error(error);
  }
};

const getAllRooms = async () => {
  try {
    const allRooms = await Room.find({});
    console.log("AllRooms", allRooms);
  } catch (error) {
    console.log(error);
  }
};

const deleteRoom = async (roomId) => {
  try {
    const room = await Room.findByIdAndDelete(roomId);
    if (!room) {
      throw new Error();
    }
    return room;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { createRoom, getAllRooms };
