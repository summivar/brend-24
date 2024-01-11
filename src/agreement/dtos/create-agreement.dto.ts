import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAgreementDto {
  @ApiProperty({example: 'text', description: 'Текст пользовательского соглашения'})
  @IsString()
  text: string;
}