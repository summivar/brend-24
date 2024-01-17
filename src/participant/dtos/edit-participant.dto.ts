import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditParticipantDto {
  @ApiProperty({ example: 'Tutu', description: 'Имя бренда' })
  @IsString()
  @IsOptional()
  nameOfBrand: string;

  @ApiProperty({ example: 'TutuCompany', description: 'Имя компании' })
  @IsString()
  @IsOptional()
  nameOfCompany: string;

  @ApiProperty({ example: 'State, region...', description: 'Адрес участника' })
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty({ example: 'Sovetskiy', description: 'Район участника' })
  @IsString()
  @IsOptional()
  district: string;

  @ApiProperty({ example: 'Some text..', description: 'Описание участника' })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Лого участника',
    required: false,
  })
  logo: Express.Multer.File;
}