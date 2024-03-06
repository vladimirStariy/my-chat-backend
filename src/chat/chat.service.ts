import { HttpException, HttpStatus, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Message } from './model/message.model';
import { ChatRoom } from './model/chat.room.model';
import { IMessages } from './dto/message.dto';
import { User } from 'src/user/models/user.model';
import { UserService } from 'src/user/user.service';

export interface MessageDto {
  id: number, 
  text: string, 
  username: string, 
  createdDate: Date
}
@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message) private messageRepository: typeof Message,
    @InjectModel(ChatRoom) private chatRoomRepository: typeof ChatRoom,
    private userService: UserService
  ) {}
  async sendMessage(userId: number, chatRoomId: string, text: string) {
    try {
      const resp = await this.messageRepository.create({
        userId: userId,
        chatRoomId: chatRoomId,
        text: text
      })
    } catch (e) {
      throw new Error(e.message);
    }
  }
  async getChatMessages(chatRoomId: string, userId: number, offset: number, limit: number) {
    try {
      const resp = await this.messageRepository.findAll({ 
        where: {chatRoomId: chatRoomId}
      })
      const messageDto: IMessages[] = [];
      await Promise.all(
        resp.map(async (item) => {
          const user = await this.userService.getById(item.userId);
          messageDto.push({
            id: item.id,
            text: item.text,
            userId: item.userId,
            usertag: user.usertag,
            messageDate: item.createdAt
          })
        })
      )
      return messageDto;
    } catch (e) {
        throw new Error(e.message);
    }
  }
}