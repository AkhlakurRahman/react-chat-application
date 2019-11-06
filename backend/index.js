const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const router = require('./router');
const { addUser, getUser, getUsersInRoom, removeUser } = require('./user');

const PORT = process.env.PORT || 4444;

const app = express();
// creating server
const server = http.createServer(app);
// creating socketio instance
const io = socketio(server);

io.on('connection', socket => {
  // Admin generated messages to frontend
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    // Welcome message from admin to ${user.name} for joining a room
    socket.emit('message', {
      user: 'Admin',
      text: `Hi ${user.name}, welcome to room ${user.room}`
    });

    // Letting everybody know that ${user.name} has joined to ${user.room} except ${user.name}
    socket.broadcast
      .to(user.room)
      .emit('message', { user: 'Admin', text: `${user.name}, has joined!'` });

    socket.join(user.room);

    callback();
  });

  // User generated message from frontend
  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    // Sending message to the specific room
    io.to(user.room).emit('message', { user: user.name, text: message });

    callback();
  });

  socket.on('disconnect', () => {
    console.log('user left!!');
  });
});

app.use(router);

server.listen(PORT, () =>
  console.log(`Server started on port: http://localhost:${PORT}`)
);
