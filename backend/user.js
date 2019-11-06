const users = [];

const addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find(
    user => user.room === room && user.name === name
  );

  if (existingUser) {
    return { error: 'User already exists!' };
  }

  const user = { id, name, room };

  users.push(user);

  return { user };
};

const getUser = id => users.find(user => user.id === id);

const getUsersInRoom = room => users.filter(user => user.room === room);

const removeUser = id => {
  // return users.filter(user.id !== id);

  const index = users.findIndex(user => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1);
  }
};

module.exports = { addUser, getUser, getUsersInRoom, removeUser };
