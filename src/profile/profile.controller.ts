import { Body, Controller, Delete, Get, Req, Param, Post, UseGuards, UsePipes } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('profile')
export class ProfileController {

    constructor(private profileService: ProfileService) {}

    @Post('/add-friend')
    async addFriend() {
        
    }

    @Post('/accept-friend')
    async acceptFriend() {

    }

    @Post('/reject-friend')
    async rejectFriend() {

    }
}
