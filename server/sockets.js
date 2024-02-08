// server/sockets.js

module.exports = function(io) {
    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('joinRoom', (room) => {
            socket.join(room);
            console.log(`User joined room: ${room}`);
        });

        socket.on('leaveRoom', (room) => {
            socket.leave(room);
            console.log(`User left room: ${room}`);
        });

        socket.on('chatMessage', (data) => {
            
            io.to(data.room).emit('message', data);
        });

        // Handle "user is typing" event
        socket.on('typing', (data) => {
            
            socket.to(data.room).emit('userTyping', data.username);
        });

        // Handle disconnect event
        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
};
