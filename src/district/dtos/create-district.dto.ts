import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateDistrictDto {
  @ApiProperty({example: 'Ленинский', description: 'Название района'})
  @IsString()
  name: string;
}