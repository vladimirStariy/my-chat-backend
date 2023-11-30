import { WebSocketGateway, 
    SubscribeMessage, 
    MessageBody, 
    WebSocketServer,
    ConnectedSocket, 
    OnGatewayConnection,
    OnGatewayDisconnect
} from "@nestjs/websockets";

import { Socket, Server } from 'socket.io'
import { UserService } from "src/user/user.service";

export interface CommentPayload {
    userId: number;
    collectionItemId: number;
    text: string;
}

@WebSocketGateway({
    cors: true
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor() {}

    @WebSocketServer() server: Server;

    private connectedClients: Socket[] = [];

    handleConnection(client: Socket) {
        this.connectedClients.push(client)
    }

    handleDisconnect(client: Socket) {
        this.connectedClients.splice(this.connectedClients.indexOf(client), 1);
    }

    @SubscribeMessage('messageToServer')
    handleSendMessage(client: Socket, message: { room: string; text: string;}) {
        console.log("text to client " + message.text)
        this.connectedClients.forEach(x => {x.emit('messageToServer', message.text)})
        this.server.to(message.room).emit('messageToServer', message.text)
    }

    @SubscribeMessage('leaveChat')
    handleLeaveChar(client: Socket, room: string) {
        client.leave(room);
        console.log('leaved')
        client.emit('leaveRoom', room)
    }

    @SubscribeMessage('joinChat')
    handleJoinChat(client: Socket, room: string) {
        client.join(room);
        console.log('joined')
        client.emit('joinedChat', room)
    }
}