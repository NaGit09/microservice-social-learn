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
  ) { }

  // check user info valid 
  async validateUser(dto: LoginDto)
    : Promise<JwtPayload> {
    const { email, password } = dto;

    // check input 
    if (!email || !password) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    // caching data in redis 
    let account;
    const cacheKey = `auth:account:${email}`;

    account = await this.redis.getData<AccountDocument>(cacheKey);
    if (!account) {
      account = await this.authModel
        .findOne({ email })
        .select('+password')
        .exec();
      this.redis.setData(cacheKey, account, REDIS_TTL);
    }
    
    // check user existed 
    if (!account) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    // check password match 
    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return { ...new JwtPayload(account) };
  }
  // user create new account 
  async register(dto: RegisterDto)
    : Promise<ApiResponse<boolean>> {
    const { email, username, password, fullname } = dto;
    // check user existed 
    const existingUser = await this.authModel
      .findOne({ email, username })
      .exec();
    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }
    // decode password and save user info 
    // OPTIMIZATION: Reduce bcrypt rounds to 10 for performance
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.authModel({
      email,
      username,
      fullname,
      password: hashedPassword,
    });

    await newUser.save();

    const userInfo = new AccountInfo(newUser);

    // Fire and forget or parallelize if possible, but keep await for data integrity here
    await this.user.createAccount(userInfo);

    return {
      statusCode: 200,
      data: true,
      message: 'Register account successfully !',
    };
  }

  // check user existed 
  async check(id: string)
    : Promise<boolean> {
    const user = await this.authModel.findOne({ id: id }).exec();
    return !!user;
  }

  // return user info and jwt token while user login 
  async login(user: JwtPayload)
    : Promise<ApiResponse<AccountLogin>> {

    // check user data in redis and return if it had
    const cacheData = await this.redis.getData(`auth:session:${user.sub}`);
    
    if (cacheData) {
      return {
        statusCode: 200,
        data: cacheData as AccountLogin,
        message: 'Login successfully (from cache)',
      };
    }

    // sign access and refresh token 
    const accessToken = this.jwtService.sign(user, {
      secret: process.env.JWT_SECRET || 'ACCESS_SECRET_KEY',
      expiresIn: ACCESS_TOKEN_EXP,
    });

    const refreshToken = this.jwtService.sign(user, {
      secret: process.env.JWT_REFRESH_SECRET || 'REFRESH_SECRET_KEY',
      expiresIn: REFRESH_TOKEN_EXP,
    });

    // update refresh token in database
    const updatedUser = await this.authModel
      .findByIdAndUpdate(user.sub, { $set: { refreshToken } }, { new: true })
      .exec();

    if (!updatedUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const userDto = new AccountLogin(updatedUser, accessToken, refreshToken);
 
    this.redis.setData(
      `auth:session:${userDto.info.id}`,
      userDto,
      REDIS_TTL,
    ).catch(err => this.logger.error(`Failed to cache session for ${userDto.info.id}`, err));

    return {
      statusCode: 200,
      data: userDto,
      message: 'Login successfully',
    };
  }

  // refresh new access token if access token has expired
  async refreshToken(tokenReq: TokenReq)
    : Promise<ApiResponse<string>> {
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

    // OPTIMIZATION: Non-blocking redis set
    this.redis.setData(
      `auth:session:${newAccessToken}`,
      userDtoForRedis,
      REDIS_TTL,
    ).catch(err => this.logger.error(`Failed to cache refresh session`, err));

    return {
      statusCode: 200,
      data: newAccessToken,
      message: 'Refresh access token successfully !',
    };
  }

  // user logout escapse system and remove refresh token 
  async logout(accessToken: string)
    : Promise<ApiResponse<boolean>> {
    try {
      const decoded = this.jwtService.decode(accessToken) as any;

      if (decoded && decoded.sub) {
        // OPTIMIZATION: Parallelize DB update and Redis delete
        await Promise.all([
          this.authModel.updateOne(
            { _id: decoded.sub },
            { $unset: { refreshToken: 1 } },
          ),
          this.redis.delData(`auth:session:${decoded.sub}`)
        ]);
      }
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
