import {
  Injectable,
  HttpException,
  HttpStatus,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtPayload } from '../common/types/JwtPayload';
import type { RegisterDto } from '../common/dto/account/register';
import type { LoginDto } from '../common/dto/account/login';
import { ApiResponse } from '../common/types/api.res';
import { Account, AccountDocument } from 'src/common/entities/account';
import { UserService } from 'src/user/user.service';
import { TokenReq } from 'src/common/dto/account/token';
import { AccountInfo, AccountLogin } from 'src/common/types/account';
import { RedisService } from 'src/redis/config.redis';
import {
  ACCESS_TOKEN_EXP,
  REFRESH_TOKEN_EXP,
  REDIS_TTL,
} from 'src/common/constant/constants';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly user: UserService,
    @InjectModel(Account.name) private authModel: Model<AccountDocument>,
    private jwtService: JwtService,
    private redis: RedisService,
  ) {}

  async validateUser(dto: LoginDto): Promise<JwtPayload> {
    const { email, password } = dto;
    const account = await this.authModel
      .findOne({ email })
      .select('+password')
      .exec();
    if (!account) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return { ...new JwtPayload(account) };
  }

  async register(dto: RegisterDto): Promise<ApiResponse<boolean>> {
    const { email, username, password, fullname } = dto;
    const existingUser = await this.authModel
      .findOne({ email, username })
      .exec();
    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new this.authModel({
      email,
      username,
      fullname,
      password: hashedPassword,
    });
    await newUser.save();

    const userInfo = new AccountInfo(newUser);
    await this.user.create(userInfo);

    return {
      statusCode: 200,
      data: true,
      message: 'Register account successfully !',
    };
  }

  async check(id: string): Promise<boolean> {
    const user = await this.authModel.findOne({ id: id }).exec();
    return !!user;
  }

  async login(user: JwtPayload): Promise<ApiResponse<AccountLogin>> {
    const cacheData = await this.redis.getData(`auth:session:${user.sub}`);
    if (cacheData) {
      return {
        statusCode: 200,
        data: cacheData as AccountLogin,
        message: 'Login successfully (from cache)',
      };
    }

    const accessToken = this.jwtService.sign(user, {
      secret: process.env.JWT_SECRET || 'ACCESS_SECRET_KEY',
      expiresIn: ACCESS_TOKEN_EXP,
    });

    const refreshToken = this.jwtService.sign(user, {
      secret: process.env.JWT_REFRESH_SECRET || 'REFRESH_SECRET_KEY',
      expiresIn: REFRESH_TOKEN_EXP,
    });

    const updatedUser = await this.authModel
      .findByIdAndUpdate(user.sub, { $set: { refreshToken } }, { new: true })
      .exec();

    if (!updatedUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const userDto = new AccountLogin(updatedUser, accessToken, refreshToken);

    await this.redis.setData(
      `auth:session:${userDto.info.id}`,
      userDto,
      REDIS_TTL,
    );

    return {
      statusCode: 200,
      data: userDto,
      message: 'Login successfully',
    };
  }

  async refreshToken(tokenReq: TokenReq): Promise<ApiResponse<string>> {
    const { userId } = tokenReq;

    const user = await this.authModel.findById(userId).exec();
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const payload: JwtPayload = { ...new JwtPayload(user) };

    const newAccessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'ACCESS_SECRET_KEY',
      expiresIn: ACCESS_TOKEN_EXP,
    });

    const userDtoForRedis = new AccountLogin(
      user,
      newAccessToken,
      user.refreshToken || '',
    );

    await this.redis.setData(
      `auth:session:${newAccessToken}`,
      userDtoForRedis,
      REDIS_TTL,
    );

    return {
      statusCode: 200,
      data: newAccessToken,
      message: 'Refresh access token successfully !',
    };
  }

  async logout(accessToken: string): Promise<ApiResponse<boolean>> {
    try {
      const decoded = this.jwtService.decode(accessToken) as any;

      if (decoded && decoded.sub) {
        await this.authModel.updateOne(
          { _id: decoded.sub },
          { $unset: { refreshToken: 1 } },
        );
      }
      await this.redis.delData(`auth:session:${decoded.sub}`);
    } catch (error) {
      this.logger.error('Error parsing token during logout', error);
    }

    return {
      statusCode: 200,
      data: true,
      message: 'Logged out successfully',
    };
  }
}
