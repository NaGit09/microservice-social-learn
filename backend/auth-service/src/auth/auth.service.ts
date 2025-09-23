import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account, AccountDocument } from './entities/account.entity';
import { JwtPayload } from './types/JwtPayload';
import type { RegisterDto } from './dto/register.dto';
import type { LoginDto } from './dto/login.dto';
import { KafkaService } from './kafka/auth.kafka';
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
    const { email, username, password } = dto;
    // validation
    const existingUser = await this.authModel
      .findOne({ email: email, username: username })
      .exec();
    if (existingUser) throw new ConflictException('User already exists');
    // hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new this.authModel({
      email,
      username,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    // return object without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = savedUser.toObject();
    this.kafka.sendMessage('user-create', {
      userId: String(result._id),
      username: result.username,
    });

    return savedUser;
  }

  async validateUser(dto: LoginDto): Promise<JwtPayload> {
    const { email, password } = dto;
    const user = await this.authModel.findOne({ email: email }).exec();
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    return {
      username: user.username,
      sub: String(user._id),
      role: user.role,
      permissions: user.permissions,
      iss: 'nhutanh09',
    };
  }

  async login(user: JwtPayload) {
    const payload: JwtPayload = {
      sub: user.sub,
      username: user.username,
      role: user.role,
      permissions: user.permissions,
      iss: user.iss,
    };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'ACCESS_SECRET_KEY',
      expiresIn: '45m',
    });
    console.log('JWT_SECRET in NestJS:', process.env.JWT_SECRET);

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'REFRESH_SECRET_KEY',
      expiresIn: '7d',
    });

    // Lưu refresh token vào DB (tùy nhu cầu)
    await this.authModel.updateOne(
      { _id: user.sub },
      { $set: { refreshToken } },
    );

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async refreshToken(userId: string) {
    const user: AccountDocument | null = await this.authModel
      .findById(userId)
      .exec();
    if (!user) throw new UnauthorizedException('User not found');

    // Sinh access token mới
    const newAccessToken = this.jwtService.sign(
      { sub: String(user._id), username: user.username },
      {
        secret: process.env.JWT_SECRET || 'ACCESS_SECRET_KEY',
        expiresIn: '45m',
      },
    );

    return { access_token: newAccessToken };
  }

  async logout(userId: string) {
    // Xoá refresh token trong DB
    await this.authModel.updateOne(
      { _id: userId },
      { $unset: { refreshToken: 1 } }, // xoá refreshToken field
    );
    return { message: 'Logged out successfully' };
  }
}
