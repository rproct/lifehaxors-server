import {
    ConnectedSocket,
    OnConnect,
    SocketController,
    SocketIO
} from 'socket-controllers';
import {Socket, Server} from 'socket.io';

@SocketController()
export class MainControl {
    @OnConnect()
    public onConnection(
        @ConnectedSocket() socket: Socket,
        @SocketIO() io: Server    
    ){
        console.log(`Socket ID ${socket.id} connected`);
    }
}