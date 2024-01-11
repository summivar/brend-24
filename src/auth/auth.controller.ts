import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto, SignupDto } from './dtos';
import { UserRequest } from './types';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards';
import { Request, Response } from 'express';
import { COOKIE_EXPIRES, COOKIE_KEY } from '../constants';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @ApiOperation({ summary: 'Регистрация аккаунта. В куки RefreshToken, возвращает AccessToken' })
  @Post('signup')
  async signup(@Body() signupDto: SignupDto, @Res({ passthrough: true }) response: Response) {
    const tokens = await this.authService.signup(signupDto);
    const expirationTime = new Date();
    expirationTime.setSeconds(expirationTime.getSeconds() + COOKIE_EXPIRES.REFRESH_TOKEN);
    response.cookie(COOKIE_KEY.REFRESH_TOKEN, tokens.refreshToken, {
      httpOnly: true,
      expires: expirationTime,
    });

    return tokens.accessToken;
  }

  @ApiOperation({ summary: 'Авторизация в аккаунт. В куки RefreshToken, возвращает AccessToken' })
  @Post('signin')
  async signin(@Body() signinDto: SigninDto, @Res({ passthrough: true }) response: Response) {
    const tokens = await this.authService.signin(signinDto);
    const expirationTime = new Date();
    expirationTime.setSeconds(expirationTime.getSeconds() + COOKIE_EXPIRES.REFRESH_TOKEN);
    response.cookie(COOKIE_KEY.REFRESH_TOKEN, tokens.refreshToken, {
      httpOnly: true,
      expires: expirationTime,
    });

    return tokens.accessToken;
  }

  @ApiOperation({ summary: 'Выход из аккаунта. Очищает в куках RefreshToken' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: UserRequest, @Res({ passthrough: true }) response: Response) {
    response.clearCookie(COOKIE_KEY.REFRESH_TOKEN);
    return this.authService.logout(req.user.sub);
  }

  @ApiOperation({ summary: 'Обновление токенов. В куки RefreshToken, возвращает AccessToken' })
  @Post('refresh')
  async refreshTokens(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const refreshToken = request.cookies[COOKIE_KEY.REFRESH_TOKEN];
    const tokens = await this.authService.refreshTokens(refreshToken);
    const expirationTime = new Date();
    expirationTime.setSeconds(expirationTime.getSeconds() + COOKIE_EXPIRES.REFRESH_TOKEN);
    response.cookie(COOKIE_KEY.REFRESH_TOKEN, tokens.refreshToken, {
      httpOnly: true,
      expires: expirationTime,
    });

    return tokens.accessToken;
  }
}
