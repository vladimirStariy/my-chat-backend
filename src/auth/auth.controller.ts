import { Res, Req, Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express'
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    async login(@Res({passthrough: true}) response: Response, @Body() loginDto: LoginDto) {
        const pairTokens = await this.authService.login(loginDto);
        response.cookie('refreshToken', pairTokens.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });
        return { access: pairTokens.accessToken };
    }

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        const response = await this.authService.register(registerDto);
        return response;
    }

    @Get('refresh')
    async refresh(@Req() request: Request, @Res({passthrough:true }) response: Response) {
        const pairTokens = await this.authService.refresh(request.cookies['refreshToken']);
        response.cookie('refreshToken', pairTokens.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });
        return { access: pairTokens.accessToken };
    }

    @Get('logout')
    async logout(@Res({ passthrough: true }) response: Response) {
        response.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });
    }
}
