import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditAgreementDto {
  @ApiProperty({example: 'text', description: 'Новый текст пользовательского соглашения'})
  @IsString()
  newText: string;
}