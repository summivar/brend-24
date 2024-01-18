import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditPartnerDto {
  @ApiProperty({ example: 'TutuCompany', description: 'Имя компании', required: false })
  @IsString()
  @IsOptional()
  nameOfCompany: string;

  @ApiProperty({ example: 'Description...', description: 'Описание компании', required: false })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Лого участника',
    required: false,
  })
  @IsOptional()
  logo: Express.Multer.File;
}