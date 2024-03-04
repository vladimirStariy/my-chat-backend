import { HttpException, HttpStatus, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Message } from './model/message.model';
import { ChatRoom } from './model/chat.room.model';

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
        @InjectModel(ChatRoom) private chatRoomRepository: typeof ChatRoom
    ) {}

    async get() {
        
    }

}