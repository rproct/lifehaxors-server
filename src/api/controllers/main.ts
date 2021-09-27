import {
    ConnectedSocket,
    OnConnect,
    OnMessage,
    MessageBody,
    SocketController,
    SocketIO,
    OnDisconnect
} from 'socket-controllers';
import {Socket, Server} from 'socket.io';

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
export class MainControl {
    @OnConnect()
    public onConnection(
        @ConnectedSocket() socket: Socket,
        @SocketIO() io: Server
    ){
        console.log(`Socket ID ${socket.id} connected`);
    }

    @OnMessage("createRoom")
    public async createRoom(
        @SocketIO() io: Server,
        @ConnectedSocket() socket: Socket,
        @MessageBody() message: any
    ){
        let roomID: string;
        // while(roomList.find(r => r.roomID === roomID).userList.length !== 0 && (roomID !== '' || roomID !== undefined)){
            roomID = '';
            for(let i = 0; i < 4; i++)
                roomID += String.fromCharCode(Math.random() * (90 - 65) + 65);
            console.log(roomID);
        // }
        await socket.join(roomID);
        let nRoom: IRoom = {roomID: roomID, userList: [{id: socket.id, name: message.name}]};
        let index = roomList.push(nRoom) - 1;
        console.log(`Joined ${roomID}`);
        socket.emit("joinedSuccess");
        io.in(roomID).emit("updateRoom", roomList[index]);
    }

    @OnMessage("joinRoom")
    public async joinRoom(
        @SocketIO() io: Server,
        @ConnectedSocket() socket: Socket,
        @MessageBody() message: any
    ){
        // const connected = io.sockets.adapter.rooms.get(message.roomID);
        // const socketRooms = Array.from(socket.rooms.values()).filter(
        //     (r) => r !== socket.id
        // );
        // if(socketRooms.length > 0 || (connected && (connected.size === 0 || connected.size === 8))){
        const room = roomList.find(r => r.roomID === message.roomID);
        if(room.userList.length === 0 || room.userList.length === 8){
            socket.emit("joinRoomErr", {error: "Room is full or does not exist."});
        }
        else{
            await socket.join(message.roomID);
            let nUser: IUser = {id: socket.id, name: message.name};
            const currentRoom = roomList.find(room => room.roomID === message.roomID);
            currentRoom.userList.push(nUser);
            socket.emit("joinedSuccess");
            io.in(currentRoom.roomID).emit("updateRoom", currentRoom);
            console.log(JSON.stringify(currentRoom))
        }
    }

    @OnMessage("submitQuestion")
    public async submitQuestion(
        @SocketIO() io: Server,
        @ConnectedSocket() socket: Socket,
        @MessageBody() message: any
    ){
        io.in(this.getRoom(socket).roomID).emit("getQuestion", {
            id: socket.id,
            question: message.question
        })
    }

    @OnDisconnect()
    public async disconnect(@ConnectedSocket() socket: Socket) {
        const room = this.getRoom(socket);
        for(let i = 0; i < room.userList.length; i++)
            if(room.userList[i].id === socket.id){
                room.userList.splice(i, 1);
                socket.to(roomList[i].roomID).emit("updateRoom", roomList[i]);
                break;
            }
        console.log(JSON.stringify(room));
        if(room.userList.length === 0)
            for(let i = 0; i < roomList.length; i++)
                if(roomList[i].roomID === room.roomID){
                    roomList.splice(i, 1);
                    break;
                }
    }

    private getRoom(socket: Socket): IRoom {
        let gameRoom;
        roomList.forEach((room) => {
            if(room.userList.find(user => user.id === socket.id))
                gameRoom = room;
        });

        return gameRoom;
    }
}
