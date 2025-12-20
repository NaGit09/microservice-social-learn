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
import type { ForgotPasswordDto, ResetPasswordDto } from '../common/dto/auth/forgot-password.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly user: UserService,
    @InjectModel(Account.name) private authModel: Model<AccountDocument>,
    private jwtService: JwtService,
    private redis: RedisService,
  ) { }

  // user create new account
  async register(dto: RegisterDto): Promise<ApiResponse<boolean>> {
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
  async check(id: string): Promise<boolean> {
    const user = await this.authModel.findOne({ id: id }).exec();
    return !!user;
  }

  async login(dto: LoginDto): Promise<ApiResponse<AccountLogin>> {
    const { email, password } = dto;

    if (!email || !password) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const user = await this.authModel
      .findOne({ email })
      .select('+password')
      .lean()
      .exec();

    // gộp lỗi để tránh user enumeration
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    if(user.isActive === false) {
      throw new HttpException('User is not active', HttpStatus.UNAUTHORIZED);
    }
    const userId = user._id.toString();
    const cacheKey = `auth:session:${userId}`;

    const cachedSession =
      await this.redis.getData<AccountLogin>(cacheKey);

    if (cachedSession) {
      return {
        statusCode: 200,
        data: cachedSession,
        message: 'Login successfully (from cache)',
      };
    }

    const payload = { ...new JwtPayload(user) };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: ACCESS_TOKEN_EXP,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: REFRESH_TOKEN_EXP,
      }),
    ]);

    const result = new AccountLogin(user, accessToken, refreshToken);

    // cache async, không block response
    this.redis
      .setData(cacheKey, result, REDIS_TTL)
      .catch(err =>
        this.logger.error(
          `Redis cache failed for user ${userId}`,
          err,
        ),
      );

    return {
      statusCode: 200,
      data: result,
      message: 'Login successfully',
    };
  }

  // refresh new access token if access token has expired
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

    // OPTIMIZATION: Non-blocking redis set
    this.redis
      .setData(`auth:session:${newAccessToken}`, userDtoForRedis, REDIS_TTL)
      .catch((err) =>
        this.logger.error(`Failed to cache refresh session`, err),
      );

    return {
      statusCode: 200,
      data: newAccessToken,
      message: 'Refresh access token successfully !',
    };
  }

  // user logout escapse system and remove refresh token
  async logout(accessToken: string): Promise<ApiResponse<boolean>> {
    try {
      const decoded = this.jwtService.decode(accessToken) as any;

      if (decoded && decoded.sub) {
        // OPTIMIZATION: Parallelize DB update and Redis delete
        await Promise.all([
          this.authModel.updateOne(
            { _id: decoded.sub },
            { $unset: { refreshToken: 1 } },
          ),
          this.redis.delData(`auth:session:${decoded.sub}`),
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
  // user forgot password
  async forgotPassword(dto: ForgotPasswordDto): Promise<ApiResponse<boolean>> {
    const { email } = dto;
    const user = await this.authModel.findOne({ email }).exec();
    if (!user) {
      // Don't reveal user existence
      return {
        statusCode: 200,
        message: 'If email exists, OTP sent',
        data: true,
      };
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save to Redis with 5 min TTL (300 seconds)
    await this.redis.setData(`auth:otp:${email}`, otp, 300);

    // Mock send email
    this.logger.log(`Mock Send Email to ${email} with OTP: ${otp}`);

    return {
      statusCode: 200,
      message: 'OTP generated',
      data: true,
    };
  }

  // verify otp and reset password
  async verifyOtpAndResetPassword(dto: ResetPasswordDto): Promise<ApiResponse<boolean>> {
    const { email, otp, newPassword } = dto;

    const storedOtp = await this.redis.getData<string>(`auth:otp:${email}`);

    if (!storedOtp || storedOtp !== otp) {
      throw new HttpException('Invalid or expired OTP', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.authModel.updateOne(
      { email },
      { password: hashedPassword }
    ).exec();

    // Delete OTP after successful use
    await this.redis.delData(`auth:otp:${email}`);

    return {
      statusCode: 200,
      message: 'Password reset successfully',
      data: true,
    };
  }
}
