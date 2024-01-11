import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsStrongPassword } from 'class-validator';

export class SigninDto {
  @ApiProperty({example: 'admin'})
  @IsString()
  username: string;

  @ApiProperty({example: 'strongAdminPassword'})
  @IsString()
  password: string;
}