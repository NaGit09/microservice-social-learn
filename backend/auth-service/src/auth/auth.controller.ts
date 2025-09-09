import { AuthService } from './auth.service';
import type { RegisterDto } from './dto/register.dto';
import type { LoginDto } from './dto/login.dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto);
    return this.authService.login(user);
  }

  @Post('auth.refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  async refresh(@Body() data: { userId: string }) {
    return this.authService.refreshToken(data.userId);
  }

  @Post('auth.logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@Body() data: { userId: string }) {
    return this.authService.logout(data.userId);
  }
}
