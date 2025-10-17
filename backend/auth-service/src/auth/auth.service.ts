import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtPayload } from '../common/types/JwtPayload';
import type { RegisterDto } from '../common/dto/account/register.dto';
import type { LoginDto } from '../common/dto/account/login.dto';
import { mapperUserToDto, mapperUserToJwtPayload } from '../common/utils/account.mapper';
import { apiResponse } from '../common/types/api.res';
import { loginRes } from '../common/types/login.res';
import { Account, AccountDocument } from 'src/common/entities/account.entity';
import { UserService } from 'src/user/user.service';
@Injectable()
export class AuthService {
  // DI
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly user : UserService,
    @InjectModel(Account.name) private authModel: Model<AccountDocument>,
    private jwtService: JwtService,
  ) { }
  //
  async validateUser(dto: LoginDto): Promise<JwtPayload> {
    const { email, password } = dto;

    const user = await this.authModel.findOne({ email }).select('+password').exec();

    if (!user) {
      this.logger.warn(`User not found for email: ${email}`);
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      this.logger.warn(`Failed login attempt for email: ${email}`);
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return mapperUserToJwtPayload(user.id, user);
  }
  //
  async register(dto: RegisterDto): Promise<apiResponse<boolean>> {
    const { email, username, password, fullname } = dto;

    const existingUser = await this.authModel
      .findOne({ email: email, username: username })
      .exec();
    if (existingUser){
      this.logger.warn('User already exists');
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }
      
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new this.authModel({
      email,
      username,
      fullname,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();

    const userInfo = mapperUserToDto(
      savedUser as Account,
    );
    await this.user.create(userInfo);

    return { statusCode: 200, data: true, message: 'Register account successfully !' };
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
      this.logger.warn("User not found !");
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const userDto = mapperUserToDto(updatedUser);

    return {
      statusCode: 200,
      data: {
        userid: userDto.id,
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
    if (!user){
      this.logger.warn("User not found !")
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }
    const payload: JwtPayload = mapperUserToJwtPayload(String(user._id), user);

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
    await this.authModel.updateOne(
      { _id: userId },
      { $unset: { refreshToken: 1 } },
    );
    return { statusCode: 200, data: true, message: 'Logged out successfully' };
  }
}
