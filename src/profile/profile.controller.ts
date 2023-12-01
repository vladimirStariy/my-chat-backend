import { Body, Controller, Delete, Get, Req, Param, Post, UseGuards, UsePipes } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { AddFriendDto } from './dto/add.friend.dto';

@Controller('profile')
export class ProfileController {

    constructor(private profileService: ProfileService) {}

    @UseGuards(JwtAuthGuard)
    @Post('/add-friend')
    async addFriend(@Req() request: any, @Body() addFriendDto: AddFriendDto) {
        console.log(request.user)
        const response = await this.profileService.addFriend(request.user.userId, addFriendDto.usertag);
        return response;
    }

    @Post('/accept-friend')
    async acceptFriend() {

    }

    @Post('/reject-friend')
    async rejectFriend() {

    }
}
