import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account, AccountDocument } from './entities/account.entity';
import { JwtPayload } from './types/JwtPayload';
import type { RegisterDto } from './dto/request/register.dto';
import type { LoginDto } from './dto/login.dto';
import { KafkaService } from './kafka/auth.kafka';
import { mapperUserToDto, mapperUserToJwtPayload } from './utils/mapper';
import { TokenInfo } from './dto/response/token.resp';
import { RefreshToken } from './dto/response/refresh.resp';
@Injectable()
export class AuthService {
  // DI
  constructor(
    private readonly kafka: KafkaService,
    @InjectModel(Account.name) private authModel: Model<AccountDocument>,
    private jwtService: JwtService,
  ) {}
  //
  async register(dto: RegisterDto) {
    const { email, username, password, fullname } = dto;
    // validation
    const existingUser = await this.authModel
      .findOne({ email: email, username: username })
      .exec();
    if (existingUser)
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    // hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new this.authModel({
      email,
      username,
      fullname,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    // return object without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = savedUser.toObject();
    const userInfo = mapperUserToDto(String(result._id), savedUser as Account);
    this.kafka.sendMessage('user-create', userInfo);

    return userInfo;
  }
  //
  async validateUser(dto: LoginDto): Promise<JwtPayload> {
    const { email, password } = dto;
    const user = await this.authModel.findOne({ email: email }).exec();
    if (!user)
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    return mapperUserToJwtPayload(String(user._id), user);
  }
  //
  async login(user: JwtPayload): Promise<TokenInfo> {
    const accessToken = this.jwtService.sign(user, {
      secret: process.env.JWT_SECRET || 'ACCESS_SECRET_KEY',
      expiresIn: '45m',
    });

    const refreshToken = this.jwtService.sign(user, {
      secret: process.env.JWT_REFRESH_SECRET || 'REFRESH_SECRET_KEY',
      expiresIn: '7d',
    });

    // Lưu refresh token vào DB (tùy nhu cầu)
    await this.authModel.updateOne(
      { _id: user.sub },
      { $set: { refreshToken } },
    );
    const tokenInfo: TokenInfo = {
      accessToken: accessToken,
      refresh_token: refreshToken,
    };
    return tokenInfo;
  }
  //
  async refreshToken(userId: string): Promise<RefreshToken> {
    const user: AccountDocument | null = await this.authModel
      .findById(userId)
      .exec();
    if (!user)
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    const payload: JwtPayload = mapperUserToJwtPayload(String(user._id), user);
    // Sinh access token mới
    const newAccessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'ACCESS_SECRET_KEY',
      expiresIn: '45m',
    });
    const refreshToken: RefreshToken = {
      access_token: newAccessToken,
    };
    return refreshToken;
  }
  //
  async logout(userId: string) {
    // Xoá refresh token trong DB
    await this.authModel.updateOne(
      { _id: userId },
      { $unset: { refreshToken: 1 } }, // xoá refreshToken field
    );
    return { message: 'Logged out successfully' };
  }
}
