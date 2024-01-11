import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SigninDto, SignupDto } from './dtos';
import { Tokens } from './types';
import { ObjectId } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { COOKIE_EXPIRES, EXCEPTION_MESSAGE } from '../constants';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
  }

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOneByUsername(username);
  }

  async signup(dto: SignupDto): Promise<Tokens> {
    const newUser = await this.usersService.create(dto);
    const tokens = await this.getToken(newUser.id, newUser.username);
    await this.usersService.updateRefreshToken(newUser.id, tokens.refreshToken);
    return tokens;
  }

  async signin(dto: SigninDto) {
    const user = await this.usersService.findOneByUsername(dto.username);
    if (!user) {
      throw new UnauthorizedException(EXCEPTION_MESSAGE.UNAUTHORIZED_EXCEPTION.INVALID_CREDENTIALS);
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedException(EXCEPTION_MESSAGE.UNAUTHORIZED_EXCEPTION.INVALID_CREDENTIALS);
    }

    const tokens = await this.getToken(user.id, user.username);
    await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(id: string) {
    return this.usersService.updateRefreshToken(id, 'null');
  }

  async refreshTokens(refreshToken: string) {
    let isExpired: boolean = false;
    try {
      await this.jwtService.verifyAsync(refreshToken, { secret: this.configService.get<string>('refreshSecret') });
    } catch (e) {
      isExpired = true;
    }
    if (!refreshToken || isExpired) {
      throw new UnauthorizedException(EXCEPTION_MESSAGE.UNAUTHORIZED_EXCEPTION.USER_IS_NOT_AUTHORIZED);
    }
    const user = await this.usersService.findOneByRefreshToken(refreshToken);

    if (!user) {
      throw new UnauthorizedException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND);
    }

    const tokens = await this.getToken(user.id, user.username);
    await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  private async getToken(userId: ObjectId, username: string): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('accessSecret'),
          expiresIn: COOKIE_EXPIRES.ACCESS_TOKEN,
        },
      ),
      this.jwtService.signAsync({
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('refreshSecret'),
          expiresIn: COOKIE_EXPIRES.REFRESH_TOKEN,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
