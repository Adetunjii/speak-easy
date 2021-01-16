const Room = require("../models/room");
const User = require("../models/users");
const { createRoom } = require("./rooms");

const users = [];
const availableRooms = [];

const addUserToRoom = async ({ roomId, userId }) => {
  const room = await Room.findById(roomId);
  if (!room) {
    return { error: "Room cannot be found" };
  }
  let users = room.users;

  if (users.length == 2) {
    room.isAvailable = false;
    await room.save();
  }

  if (room.isAvailable) {
    users = users.concat(userId);
    let userSet = new Set(users);
    users = Array.from(userSet);
    console.log(users);
    room.users = users;
    console.log(room);
    const isExists = users.find();
    await room.save();
  }
};

const addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  console.log(name, room);

  const existingUser = users.find(
    (user) => user.room === room && user.name === name
  );

  const existingRooms = users.filter((user) => user.room == room);

  //checks the amount of users in a room

  if (existingRooms.length == 2) {
    let index = availableRooms.findIndex(
      (availableRoom) => availableRoom === room
    );
    availableRooms.splice();
    return { error: "Cannot have more than two users in a room" };
  }
  if (!name || !room) return { error: "Username and room are required." };
  if (existingUser) return { error: "Username is taken." };

  const user = { id, name, room };
  console.log("user is: ", user);

  users.push(user);

  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) return users.splice(index, 1)[0];
};

const getUser = (id) => {
  const user = users.find((user) => user.id === id);

  if (!user) {
    console.log("user could not be found");
    return;
  }
  return user;
};

const addRoom = (room) => availableRooms.concat(room);
const removeRoom = (room) =>
  availableRooms.filter((availableRoom) => availableRoom !== room);
const getUsersInRoom = (room) => users.filter((user) => user.room === room);
const getAllAvailableRooms = () => Array.from(new Set(availableRooms));

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
  addRoom,
  removeRoom,
  getAllAvailableRooms,
  addUserToRoom,
};
