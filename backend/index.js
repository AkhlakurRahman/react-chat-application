const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const router = require('./router');

const PORT = process.env.PORT || 4444;

const app = express();
// creating server
const server = http.createServer(app);
// creating socketio instance
const io = socketio(server);

io.on('connection', socket => {
  console.log('New connection was created!!');

  socket.on('disconnect', () => {
    console.log('user left!!');
  });
});

app.use(router);

server.listen(PORT, () =>
  console.log(`Server started on port: http://localhost:${PORT}`)
);
