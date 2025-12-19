import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { fromAuthHeaderAsBearerToken } from './utils';
import { JwtPayload } from '../types/JwtPayload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: fromAuthHeaderAsBearerToken,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? 'MY_SECRET_KEY',
    });
  }

  validate(payload: JwtPayload) {
    return { userId: payload.sub, username: payload.username, role: payload.role };
  }
}
