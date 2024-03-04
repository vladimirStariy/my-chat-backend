import { Body, Controller, Delete, Get, Param, Post, UseGuards, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
@ApiTags("User controller")
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService
  ) {}
  @Get('/users')
  async getUsersWithPagination() {
  }
}