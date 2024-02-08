// server/app.js

const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const config = require('./config');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const userRoutes = require('./routes/userRoutes');
const sockets = require('./sockets');
const path = require('path');
const chatRooms = ['devops', 'cloud computing', 'covid19', 'sports', 'nodeJS'];


const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'client')));


// Connect to MongoDB
mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/user', userRoutes);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
  });

// Socket.IO configuration and event handling
sockets(io);


io.on('connection', (socket) => {
    console.log('A user connected');

    // Join a room
    socket.on('join room', (room) => {
        if (chatRooms.includes(room)) {
            socket.join(room);
            console.log(`User joined the room: ${room}`);
            socket.emit('joined room', room);
        } else {
            socket.emit('error', 'Room does not exist.');
        }
    });

    // Leave a room
    socket.on('leave room', (room) => {
        socket.leave(room);
        console.log(`User left the room: ${room}`);
        socket.emit('left room', room);
    });

    // Broadcast a message to a room
    socket.on('chat message', ({ room, msg }) => {
        if (chatRooms.includes(room)) {
            io.to(room).emit('chat message', msg);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});


// Start server
const PORT = process.env.PORT || 3030;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
