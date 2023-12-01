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
        this.server.to(message.room).emit('messageToServer', {message: message.text, client: client.id})
    }

    @SubscribeMessage('leaveChat')
    handleLeaveChar(client: Socket, room: string) {
        client.leave(room);
        client.emit('leaveRoom', room)
    }

    @SubscribeMessage('joinChat')
    handleJoinChat(client: Socket, room: string) {
        client.join(room);
        client.emit('joinedChat', room)
    }
}