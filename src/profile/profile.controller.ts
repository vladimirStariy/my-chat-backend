import { Body, Controller, Delete, Get, Req, Param, Post, UseGuards, UsePipes, Query, Res, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { AcceptFriendDto, AddFriendDto } from './dto/add.friend.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ProfileDto } from './dto/profile.dto';
import { Response } from 'express';
@ApiTags("Profile controller")
@Controller('profile')
export class ProfileController {
  constructor(
    private profileService: ProfileService
  ) {}
  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async getProfile(
    @Req() request: any,
    @Res() response: Response
  ): Promise<Response> {
    try {
      const resp = await this.profileService.getProfile(request.user.userId);
      return response.status(HttpStatus.OK).json(resp);
    } catch(e) {
      if (e instanceof Error) {
        return response.status(HttpStatus.BAD_REQUEST).json(e.message);
      }
    }
  }
  @UseGuards(JwtAuthGuard)
  @Get('/friends')
  async getFriends(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Req() request: any,
    @Res() response: Response
  ): Promise<Response> {
    try {
      const resp = await this.profileService.getFriends(request.user.userId);
      return response.status(HttpStatus.OK).json(resp);
    } catch(e) {
      if (e instanceof Error) {
        return response.status(HttpStatus.BAD_REQUEST).json(e.message);
      }
    }
  }
  @UseGuards(JwtAuthGuard)
  @Post('/add-friend')
  async addFriend(@Req() request: any, @Body() addFriendDto: AddFriendDto) {
    const response = await this.profileService.addFriend(request.user.userId, addFriendDto.usertag);
    return response;
  }
  @UseGuards(JwtAuthGuard)
  @Post('/accept-friend')
  async acceptFriend(@Req() request: any, @Body() acceptFriendDto: AcceptFriendDto) {
    const response = await this.profileService.acceptFriendRequest(acceptFriendDto.usertag, request.user.userId)
    return response;
  }
  @UseGuards(JwtAuthGuard)
  @Post('/reject-friend')
  async rejectFriend(@Req() request: any, @Body() rejectFriendDto: AcceptFriendDto) {
    const response = await this.profileService.acceptFriendRequest(rejectFriendDto.usertag, request.user.userId)
    return response;
  }
  @UseGuards(JwtAuthGuard)
  @Get('/friend-requests')
  async getFriendRequests(@Req() request: any) {
    const response = await this.profileService.getFriendsRequests(request.user.userId);
    return response;
  }

}
