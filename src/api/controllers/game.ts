import {
    ConnectedSocket,
    MessageBody,
    OnMessage,
    SocketController,
    SocketIO
} from 'socket-controllers';
import {Server, Socket} from 'socket.io';

@SocketController()
export class GameControl {
    private getRoom(socket: Socket): string {
        const socketRooms = Array.from(socket.rooms.values()).filter(
            (r) => r !== socket.id
        );
        const gameRoom = socketRooms && socketRooms[0];

        return gameRoom;
    }
}