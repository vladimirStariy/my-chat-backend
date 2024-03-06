import { Body, Controller, Delete, Get, Req, Param, Post, UseGuards, UsePipes, Res, Query, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ChatService } from './chat.service';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags("Chat controller")
@Controller('chat')
export class ChatController {
  constructor(
    private chatService: ChatService
  ) {}
  @UseGuards(JwtAuthGuard)
  @Get('messages')
  async chatMessages(
    @Query('chatRoomId') chatRoomId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Req() request: any,
    @Res() response: Response
  ):Promise<Response> {
    try {
      const messages = await this.chatService.getChatMessages(chatRoomId, request.user.usertag, page, limit);
      return response.status(HttpStatus.OK).json(messages);
    } catch(e) {
      if (e instanceof Error) {
        return response.status(HttpStatus.BAD_REQUEST).json(e.message);
      }
    }
  }
}
