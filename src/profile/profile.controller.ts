import { Body, Controller, Delete, Get, Req, Param, Post, UseGuards, UsePipes } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { AcceptFriendDto, AddFriendDto } from './dto/add.friend.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags("Profile controller")
@Controller('profile')
export class ProfileController {
  constructor(
    private profileService: ProfileService
  ) {}
  @UseGuards(JwtAuthGuard)
  @Post('/add-friend')
  async addFriend(@Req() request: any, @Body() addFriendDto: AddFriendDto) {
    const response = await this.profileService.addFriend(request.user.userId, addFriendDto.usertag);
    return response;
  }
  @UseGuards(JwtAuthGuard)
  @Get('/my-friends')
  async getFriends(@Req() request: any) {
    const response = await this.profileService.getFriends(request.user.userId);
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
