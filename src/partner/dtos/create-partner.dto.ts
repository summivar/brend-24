import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Prop } from '@nestjs/mongoose';

export class CreatePartnerDto {
  @ApiProperty({ example: 'TutuCompany', description: 'Имя компании' })
  @IsString()
  nameOfCompany: string;

  @ApiProperty({ example: 'Description...', description: 'Описание компании' })
  @IsString()
  description: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Лого участника',
    required: true,
  })
  logo: Express.Multer.File;
}