import { AuthService } from './auth.service';
import { RegisterSchema, type RegisterDto } from '../common/dto/account/register';
import { LoginSchema, type LoginDto } from '../common/dto/account/login';
import { Body, Controller, Headers, Patch, Post, UseGuards, UsePipes } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ZodValidationPipe } from 'src/common/pipe/ZodValidationPipe';
import { TokenReqSchema, type TokenReq } from 'src/common/dto/account/token';
import { RedisAuth } from 'src/redis/redis-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  @Post('register')
  @UsePipes(new ZodValidationPipe(RegisterSchema))
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @UsePipes(new ZodValidationPipe(LoginSchema))
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Patch('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @UsePipes(new ZodValidationPipe(TokenReqSchema))

  async refresh(@Body() data: TokenReq) {
    return this.authService.refreshToken(data);
  }

  @Patch('logout')
  @UseGuards(RedisAuth) 
  async logout(@Headers('authorization') authHeader: string) {
    const token = authHeader.split(' ')[1];
    return this.authService.logout(token);
  }
}
