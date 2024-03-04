import { UseFilters, UseGuards } from "@nestjs/common";
import { 
  WebSocketGateway, 
  SubscribeMessage, 
  MessageBody, 
  WebSocketServer,
  ConnectedSocket, 
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException
} from "@nestjs/websockets";

import { Socket, Server } from 'socket.io'
import { SocketExceptionsFilter } from "src/auth/filters/ws.exception.filter";
import { SocketUserGuard } from "src/auth/guards/socket.user.guard";
import { UserService } from "src/user/user.service";

export interface CommentPayload {
  userId: number;
  collectionItemId: number;
  text: string;
}
@WebSocketGateway({
  cors: true,
  namespace: '/chat'
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

    @UseGuards(SocketUserGuard)
    @SubscribeMessage('messageToServer')
    handleSendMessage(client: Socket, message: { room: string; text: string;}) {
      this.server.to(message.room).emit('messageToServer', {message: message.text, client: client.id})
    }

    @UseGuards(SocketUserGuard)
    @SubscribeMessage('leaveChat')
    handleLeaveChar(client: Socket, room: string) {
        client.leave(room);
        client.emit('leaveRoom', room)
    }

    @UseGuards(SocketUserGuard)
    @SubscribeMessage('joinChat')
    handleJoinChat(client: Socket, room: string) {
        client.join(room);
        client.emit('joinedChat', room)
    }
}