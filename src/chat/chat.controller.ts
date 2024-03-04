import { Body, Controller, Delete, Get, Req, Param, Post, UseGuards, UsePipes } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post('')
  async rejectFriend() {

  }
}
