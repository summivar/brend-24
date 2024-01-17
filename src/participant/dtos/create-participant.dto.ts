import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateParticipantDto {
  @ApiProperty({ example: 'Tutu', description: 'Имя бренда' })
  @IsString()
  nameOfBrand: string;

  @ApiProperty({ example: 'TutuCompany', description: 'Имя компании' })
  @IsString()
  nameOfCompany: string;

  @ApiProperty({ example: 'State, region...', description: 'Адрес участника' })
  @IsString()
  address: string;

  @ApiProperty({ example: 'Sovetskiy', description: 'Район участника' })
  @IsString()
  district: string;

  @ApiProperty({ example: 'Some text..', description: 'Описание участника' })
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