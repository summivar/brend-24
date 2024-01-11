import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditPrivacyDto {
  @ApiProperty({example: 'text', description: 'Новый текст политики конфиденциальности'})
  @IsString()
  newText: string;
}