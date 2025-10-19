import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
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
@Injectable()
export class AuthService {
  // DI
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly user: UserService,
    @InjectModel(Account.name) private authModel: Model<AccountDocument>,
    private jwtService: JwtService,
  ) { }
  //
  async validateUser(dto: LoginDto): Promise<JwtPayload> {
    const { email, password } = dto;

    const account = await this.authModel.findOne({ email }).select('+password').exec();

    if (!account) {
      this.logger.warn(`User not found for email: ${email}`);
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const isMatch = await bcrypt.compare(password, account.password);

    if (!isMatch) {
      this.logger.warn(`Failed login attempt for email: ${email}`);
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return new JwtPayload(account);
  }
  //
  async register(dto: RegisterDto): Promise<ApiResponse<boolean>> {
    const { email, username, password, fullname } = dto;

    const existingUser = await this.authModel
      .findOne({ email: email, username: username })
      .exec();
    if (existingUser) {
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
    await newUser.save();

    const userInfo = new AccountInfo(newUser);
    await this.user.create(userInfo);

    return { statusCode: 200, data: true, message: 'Register account successfully !' };
  }
  //
  async login(user: JwtPayload): Promise<ApiResponse<AccountLogin>> {
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

    const userDto = new AccountLogin(updatedUser,accessToken,refreshToken);
    return {
      statusCode: 200,
      data: userDto,
      message: 'Login successfully',
    };
  }
  //
  async refreshToken(tokenReq: TokenReq): Promise<ApiResponse<string>> {

    const { userId } = tokenReq;
    const user: AccountDocument | null = await this.authModel
      .findById(userId)
      .exec();
    if (!user) {
      this.logger.warn("User not found !")
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }
    const payload: JwtPayload = new JwtPayload( user);

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
  async logout(tokenReq: TokenReq): Promise<ApiResponse<boolean>> {
    const { userId } = tokenReq;

    await this.authModel.updateOne(
      { _id: userId },
      { $unset: { refreshToken: 1 } },
    );
    return { statusCode: 200, data: true, message: 'Logged out successfully' };
  }
  // 
  async check(id: string): Promise<boolean> {
    const user = await this.authModel.findOne({id: id}).exec();
    if(!user) return false;
    return true;
  }
}
