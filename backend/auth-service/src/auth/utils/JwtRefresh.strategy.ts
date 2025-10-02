import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { JwtPayload } from '../types/JwtPayload';
import { fromAuthHeaderAsBearerToken } from './utils';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: fromAuthHeaderAsBearerToken,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET ?? 'MY_REFRESH_SECRET',
    });
  }

  validate(payload: JwtPayload) {
    console.log(payload);
    return { userId: payload.sub, username: payload.username };
  }
}
