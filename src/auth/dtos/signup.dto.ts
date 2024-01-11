import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsStrongPassword } from 'class-validator';

export class SignupDto {
  @ApiProperty({example: 'admin'})
  @IsString()
  username: string;

  @ApiProperty({example: 'strongAdminPassword'})
  // @IsStrongPassword({minLength: 6, minSymbols: 0, minLowercase: 1, minUppercase: 1})
  password: string;
}