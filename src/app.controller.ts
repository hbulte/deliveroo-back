import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtRefreshTokenGuard } from './auth/guard/jwt-refresh-auth.guard';
import { LocalAuthGuard } from './auth/guard/local-auth.guard';
import { LoginDto } from './dto/login.dto';
import { UserService } from './user/user.service';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;
    return this.authService.verifyUser(email, password);
  }

  //cherche le token
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req) {
    const accessToken = await this.authService.genAccessToken(req.user);
    const refreshToken = await this.authService.genRefreshToken(req.user);
    await this.userService.setCurrentRefreshToken(refreshToken, req.user.id);
    return { accessToken, refreshToken };
  }

  @Get('refresh')
  @UseGuards(JwtRefreshTokenGuard)
  async refresh(@Request() req) {
    return { accessToken: await this.authService.genAccessToken(req.user) };
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Request() req) {
    await this.userService.removeRefreshToken(req.user.id);
  }
}
