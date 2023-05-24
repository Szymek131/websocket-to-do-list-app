const express = require('express');
const path = require('path');
const socket = require('socket.io');
const cors = require('cors');

const app = express();

let tasks = [
];

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use((req, res) => {
  res.status(404).send('404 not found...');
})

const server = app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id - ' + socket.id);
  socket.emit('updateData', tasks);

  socket.on('addTask', (task) => {
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
    console.log('Succesfully added task!');
  });

  socket.on('removeTask', (taskId) => {
    const index = tasks.findIndex(item => item.id === taskId);
    tasks.splice(index, 1);
    console.log('Task removed!');
    socket.broadcast.emit('updateData', tasks);
  });
});