const mongoose = require("mongoose");
const Room = require("../models/room");
const User = require("../models/users");
const { createRoom } = require("./rooms");
const Group = require("../models/group");

const users = [];
const availableRooms = [];

const addUserToRoom = async ({ roomId, userId }) => {
  console.log(roomId, userId);
  const room = await Room.findById(roomId);
  console.log(room);
  if (!room) {
    return { error: "Room cannot be found" };
  }
  let roomUsers = room.users;
  console.log(roomUsers);
  if (roomUsers.length < 2) {
    const isExist = roomUsers.find((elem) => elem.toString() === userId);
    if (isExist) {
      return { error: "user already exists" };
    }
    roomUsers.push(userId);
    await room.save();
  }

  room.isAvailable = false;
  await room.save();
  return userId;
};

const addUserToGroup = async ({ groupId, userId }) => {
  const group = await Group.findById(roomId);
  console.log(group);
  if (!group) {
    return { error: "Group cannot be found" };
  }

  const groupMembers = group.members;

  const existingMember = groupMembers.find(
    (member) => member.toString() === userId
  );
  if (existingMember) {
    return { error: "Already a member of the group" };
  }

  groupMembers.push(userId);
  await group.save();
  return userId;
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
const getAllAvailableRooms = async () => {
  const availableRooms = await Room.find({ isAvailable: true });
  return availableRooms;
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
  addRoom,
  removeRoom,
  getAllAvailableRooms,
  addUserToRoom,
  addUserToGroup,
};
