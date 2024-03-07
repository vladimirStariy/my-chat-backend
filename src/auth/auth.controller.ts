import { Res, Req, Body, Controller, Get, Post, UseGuards, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express'
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags("Auth controller")
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) {}
  @Post('login')
  async login(
    @Res() response: Response, 
    @Body() loginDto: LoginDto
  ): Promise<Response> {
    try {
      const pairTokens = await this.authService.login(loginDto);
      response.cookie('refreshToken', pairTokens.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
      });
      return response.status(HttpStatus.OK).json(pairTokens.accessToken);
    } catch(e) {
      if (e instanceof Error) {
        return response.status(HttpStatus.BAD_REQUEST).json(e.message);
      }
    }
  }
  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res() response: Response
  ): Promise<Response> {
    try {
      const resp = await this.authService.register(registerDto);
      return response.status(HttpStatus.OK).json(resp);
    } catch(e) {
      if (e instanceof Error) {
        return response.status(HttpStatus.BAD_REQUEST).json(e.message);
      }
    }
  }
  @Get('refresh')
  async refresh(
    @Req() request: Request, 
    @Res() response: Response
  ): Promise<Response> {
    try {
      const pairTokens = await this.authService.refresh(request.cookies['refreshToken']);
      response.cookie('refreshToken', pairTokens.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
      });
      return response.status(HttpStatus.OK).json(pairTokens.accessToken);
    } catch(e) {
      if (e instanceof Error) {
        return response.status(HttpStatus.BAD_REQUEST).json(e.message);
      }
    }
  }
  @Post('logout')
  async logout(
    @Res({passthrough: true}) response: Response
  ) {
    try {
      response.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
      });
    } catch(e) {
      if (e instanceof Error) {
        return response.status(HttpStatus.BAD_REQUEST).json(e.message);
      }
    }
  }
}