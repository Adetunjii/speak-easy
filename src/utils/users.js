const users = [];
const availableRooms = [];

const addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  console.log(name, room);

  const existingUser = users.find(
    (user) => user.room === room && user.name === name
  );

  const existingRooms = users.filter((user) => user.room == room);

  //checks the amount of users in a room

  if (existingRooms.length == 2)
    return { error: "Cannot have more than two users in a room" };
  if (!name || !room) return { error: "Username and room are required." };
  if (existingUser) return { error: "Username is taken." };

  availableRooms.push(room);

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

  console.log("yaay user found: ", user.name, user.room);
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
};
