import {
    ConnectedSocket,
    MessageBody,
    OnDisconnect,
    OnMessage,
    SocketController,
    SocketIO
} from 'socket-controllers';
import {Server, Socket} from 'socket.io';

interface IUser{
    id: string;
    name: string;
}

interface IRoom{
    roomID: string;
    userList: IUser[];
}

const roomList = Array<IRoom>();

@SocketController()
export class RoomControl {
    @OnMessage("createRoom")
    public async createRoom(
        @SocketIO() io: Server,
        @ConnectedSocket() socket: Socket,
        @MessageBody() message: any
    ){
        let roomID: string;
        // do{
            roomID = '';
            for(let i = 0; i < 4; i++)
                roomID += String.fromCharCode(Math.random() * (90 - 65) + 65);
        // }while(io.sockets.adapter.rooms.get(roomID).size !== 0);
        await socket.join(roomID);
        let nRoom: IRoom = {roomID: roomID, userList: [{id: socket.id, name: message.name}]};
        roomList.push(nRoom);
        console.log(`Joined ${roomID}`);
        socket.emit("roomJoined", {code: roomID});
    }

    @OnMessage("joinRoom")
    public async joinRoom(
        @SocketIO() io: Server,
        @ConnectedSocket() socket: Socket,
        @MessageBody() message: any
    ){
        const connected = io.sockets.adapter.rooms.get(message.roomID);
        const socketRooms = Array.from(socket.rooms.values()).filter(
            (r) => r !== socket.id
        );

        if(socketRooms.length > 0 || (connected && (connected.size === 0 || connected.size === 8))){
            socket.emit("joinRoomErr", {error: "Room is full or does not exist."});
        }
        else{
            await socket.join(message.roomID);
            let nUser: IUser = {id: socket.id, name: message.name};
            const currentRoom = roomList.find(room => room.roomID === message.roomID);
            currentRoom.userList.push(nUser);
            socket.emit("roomJoined", {code: message.roomID});
            console.log(JSON.stringify(currentRoom))
        }
    }
}