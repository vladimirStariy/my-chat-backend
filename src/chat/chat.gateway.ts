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
import { ChatService } from "./chat.service";

export interface CommentPayload {
  userId: number;
  collectionItemId: number;
  text: string;
}
@WebSocketGateway({
  cors: true,
  namespace: '/chat'
})
@UseFilters(SocketExceptionsFilter)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
      private chatService: ChatService
    ) {}
    @WebSocketServer() server: Server;
    private connectedClients: Socket[] = [];
    handleConnection(client: Socket) { this.connectedClients.push(client) }
    handleDisconnect(client: Socket) { this.connectedClients.splice(this.connectedClients.indexOf(client), 1) }

    @UseGuards(SocketUserGuard)
    @SubscribeMessage('messageToServer')
    async handleSendMessage(client: Socket, message: { room: string; text: string;}) {
      await this.chatService.sendMessage(Number(client.handshake.headers.userId), message.room, message.text);
      await this.server.to(message.room).emit('messageToServer', {
        message: message.text, 
        client: client.id, 
        userId: Number(client.handshake.headers.userId),
        username: client.handshake.headers.userName.toString()
      })
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