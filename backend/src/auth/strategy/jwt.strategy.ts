import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'topsecret',
      passReqToCallback: true, 
    });
  }

  async validate(payload: { id: number; email: string },  req: Request) {
    if (!payload) throw new UnauthorizedException();
    
    const user = await this.usersService.findUserById(payload.id);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
