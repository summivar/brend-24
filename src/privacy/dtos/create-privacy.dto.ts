import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePrivacyDto {
  @ApiProperty({example: 'text', description: 'Текст политики конфиденциальности'})
  @IsString()
  text: string;
}