import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AdminGuard } from './guards';
import { UsersService } from '../users/users.service';

@Global()
@Module({
  imports: [
    UsersModule,
    JwtModule.register({})
  ],
  controllers: [AuthController],
  providers: [AuthService, AdminGuard, JwtService],
  exports: [AdminGuard, JwtService],
})
export class AuthModule {
}
