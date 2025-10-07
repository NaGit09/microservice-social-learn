import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account, AccountDocument } from './entities/account.entity';
import { JwtPayload } from './types/JwtPayload';
import type { RegisterDto } from './dto/request/register.dto';
import type { LoginDto } from './dto/request/login.dto';
import { KafkaService } from './kafka/auth.kafka';
import { mapperUserToDto, mapperUserToJwtPayload } from './utils/mapper';
import { apiResponse } from './types/api.res';
import { loginRes } from './types/login.res';
@Injectable()
export class AuthService {
  // DI
  constructor(
    private readonly kafka: KafkaService,
    @InjectModel(Account.name) private authModel: Model<AccountDocument>,
    private jwtService: JwtService,
  ) {}
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
  async register(dto: RegisterDto): Promise<apiResponse<boolean>> {
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

    const userInfo = mapperUserToDto(
      String(savedUser._id),
      savedUser as Account,
    );
    this.kafka.sendMessage('user-create', userInfo);

    return { statusCode: 200, data: true, message: '' };
  }
  //
  async login(user: JwtPayload): Promise<apiResponse<loginRes>> {
    //
    const accessToken = this.jwtService.sign(user, {
      secret: process.env.JWT_SECRET || 'ACCESS_SECRET_KEY',
      expiresIn: '45m',
    });

    const refreshToken = this.jwtService.sign(user, {
      secret: process.env.JWT_REFRESH_SECRET || 'REFRESH_SECRET_KEY',
      expiresIn: '7d',
    });

    const updatedUser = await this.authModel
      .findByIdAndUpdate(user.sub, { $set: { refreshToken } }, { new: true })
      .exec();

    if (!updatedUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const userDto = mapperUserToDto(String(updatedUser._id), updatedUser);

    return {
      statusCode: 200,
      data: {
        userid: userDto.userId,
        username: userDto.username,
        fullname: userDto.fullname,
        accessToken,
        refreshToken,
      },
      message: 'Login successfully',
    };
  }
  //
  async refreshToken(userId: string): Promise<apiResponse<string>> {
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
    return {
      statusCode: 200,
      data: newAccessToken,
      message: 'refresh access token successfully !',
    };
  }
  //
  async logout(userId: string): Promise<apiResponse<boolean>> {
    // Xoá refresh token trong DB
    await this.authModel.updateOne(
      { _id: userId },
      { $unset: { refreshToken: 1 } }, // xoá refreshToken field
    );
    return { statusCode: 200, data: true, message: 'Logged out successfully' };
  }
}
