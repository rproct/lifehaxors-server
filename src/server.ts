const express = require('express');
const app = express();
const socket = require('socket.io');
const cors = require('cors');
const {createRoom, joinRoom, isRoomFull} = require('./userManager');

app.use(express())

const port = process.env.PORT || 9000;

app.use(cors());

var server = app.listen(port, console.log('Server is running'));

const io = socket(server);

io.on('connection', (socket: any) => {
    socket.on('createRoom', (username: string) => {
        const room = createRoom();
        joinUser(socket.id, username, room);
    });

    socket.on('joinRoom', (username: string, room: string) => {
        if(!isRoomFull(room)){
            socket.to(socket.id).emit("error", {error: "Room is full or is not available"});
        }
        else{

        }
    });

    socket.on('disconnect', () => {

    });

    function joinUser(id: string, username: string, room: string) {
        joinRoom(id, username, room);
        socket.join(room);
    }
})