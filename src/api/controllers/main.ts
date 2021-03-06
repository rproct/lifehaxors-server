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
import socket from '../../socket';

interface IUser{
    id: string;
    name: string;
}

interface IRoom{
    roomID: string;
    lock: boolean;
    userList: IUser[];
    houseItems: string[];
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
        // }
        await socket.join(roomID);
        let nRoom: IRoom = {roomID: roomID, lock: false, userList: [{id: socket.id, name: message.name}], houseItems: []};
        let index = roomList.push(nRoom) - 1;
        socket.emit("joinedSuccess");
        io.in(roomID).emit("updateRoom", roomList[index]);
        console.log(nRoom);
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
        if(room === undefined || room.userList.length === 0){
            socket.emit("joinRoomErr", {error: "Room does not exist."});
            console.log({error: "Room does not exist."})
        }
        else if(room.userList.length === 8){
            socket.emit("joinRoomErr", {error: "Room is full, please pick another room."});
            console.log({error: "Room is full, please pick another room."})
        }
        else if(room.lock){
            socket.emit("joinRoomErr", {error: "Room is currently in an active game."});
            console.log({error: "Room is currently in an active game."})
        }
        else{
            await socket.join(message.roomID);
            let nUser: IUser = {id: socket.id, name: message.name};
            const currentRoom = roomList.find(room => room.roomID === message.roomID);
            currentRoom.userList.push(nUser);
            socket.emit("joinedSuccess");
            io.in(currentRoom.roomID).emit("updateRoom", currentRoom);
        }
    }

    @OnMessage("sendTemplate")
    public async sendTemplate(
        @SocketIO() io: Server,
        @ConnectedSocket() socket: Socket
    ){
        const questions = require('../data/questionTemplates.json');
        const rand = questions[Math.floor(Math.random() * questions.length)];
        socket.emit("receiveTemplate", rand);
    }

    @OnMessage("sendQuestion")
    public async submitQuestion(
        @SocketIO() io: Server,
        @ConnectedSocket() socket: Socket,
        @MessageBody() message: any
    ){
        io.in(this.getRoom(socket).roomID).emit("receiveQuestion", {
            id: socket.id,
            question: message.question
        })
    }

    @OnMessage("generatePairs")
    public async generatePairs(
        @SocketIO() io: Server,
        @ConnectedSocket() socket: Socket
    ){
        const room = this.getRoom(socket);
        const senders = [].concat(room.userList);
        const recipients = [].concat(room.userList);
        const pairs = [];
        while(senders.length > 0 && recipients.length > 0){
            let s = Math.floor(Math.random() * senders.length);
            let r = Math.floor(Math.random() * recipients.length);
            if(senders[s] !== recipients[r]){
                const newPair = {sendID: senders[s].id, recipID: recipients[r].id};
                pairs.push(newPair);
                senders.splice(s, 1);
                recipients.splice(r, 1);
            }
        }
        for(let i = 0; i < pairs.length; i++)
            io.to(pairs[i].sendID).emit("getPair", {recipient: pairs[i].recipID});
    }

    @OnMessage("addListItems")
    public async addListItems(
        @SocketIO() io: Server,
        @ConnectedSocket() socket: Socket,
        @MessageBody() message: any
    ){
        const room = this.getRoom(socket);
        message.houseItems.forEach((item) => {
            room.houseItems.push(item)
        })
        io.in(room.roomID).emit("playerReady", {data: room.houseItems.length / 6})
    }

    @OnMessage("appendListToQuestions")
    public async appendListToQuestions(
        @SocketIO() io: Server,
        @ConnectedSocket() socket: Socket
    ){
        const room = this.getRoom(socket);
        const players = room.userList;
        players.sort(() => Math.random() - 0.5);
        let list = [].concat(room.houseItems)
        room.houseItems = [];
        const dist = [];
        for(let i = 0; i < players.length; i++){
            list.sort(() => Math.random() - 0.5)
            dist.push({id: players[i].id, items: list.slice(0, 6)});
            list = list.slice(6);
        }
        io.in(room.roomID).emit("setQuestionList", {dist: dist})
    }

    @OnMessage("getOrder")
    public async getOrder(
        @SocketIO() io: Server,
        @ConnectedSocket() socket: Socket
    ){
        const room = this.getRoom(socket);
        const players = room.userList;
        players.sort(() => Math.random() - 0.5);
        io.in(room.roomID).emit("generateOrder", {order: players})
    }

    @OnMessage("startGame")
    public async broadcastStart(
        @SocketIO() io: Server,
        @ConnectedSocket() socket: Socket
    ){
        const room = this.getRoom(socket);
        if(room)
            io.in(room.roomID).emit("toggleStart");
    }

    @OnMessage("sendAnswer")
    public async sendAnswer(
        @SocketIO() io: Server,
        @ConnectedSocket() socket: Socket,
        @MessageBody() message: any
    ){
        const room = this.getRoom(socket);
        if(room)
            io.in(room.roomID).emit("receiveAnswer", {data: message})
    }

    @OnDisconnect()
    public async disconnect(@ConnectedSocket() socket: Socket) {
        const room = this.getRoom(socket);
        for(let i = 0; i < room.userList.length; i++)
            if(room.userList[i].id === socket.id){
                room.userList.splice(i, 1);
                socket.to(room.roomID).emit("updateRoom", room);
                break;
            }
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
