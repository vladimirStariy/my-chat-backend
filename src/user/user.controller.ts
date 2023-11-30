import { Body, Controller, Delete, Get, Param, Post, UseGuards, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

    constructor(private userService: UserService) {}

    @Get('/users')
    async getUsersWithPagination() {
        
    }

}
