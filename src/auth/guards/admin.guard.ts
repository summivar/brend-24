import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EXCEPTION_MESSAGE, ROLES_CONSTANTS } from '../../constants';
import { UsersService } from '../../users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req = context.switchToHttp().getRequest();
      const authHeader = req.headers.authorization;
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException(EXCEPTION_MESSAGE.UNAUTHORIZED_EXCEPTION.USER_IS_NOT_AUTHORIZED);
      }

      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('accessSecret'),
      });

      const user = await this.usersService.findOneById(payload.sub);

      if (!user) {
        throw new ForbiddenException(EXCEPTION_MESSAGE.FORBIDDEN_EXCEPTION.NO_RULES_TO_GET);
      }

      if (!user.roles.includes(ROLES_CONSTANTS.ADMIN)) {
        throw new ForbiddenException(EXCEPTION_MESSAGE.FORBIDDEN_EXCEPTION.NO_RULES_TO_GET);
      }

      req.user = payload;
      return true;
    } catch (e) {
      throw new ForbiddenException(EXCEPTION_MESSAGE.FORBIDDEN_EXCEPTION.NO_RULES_TO_GET);
    }
  }
}