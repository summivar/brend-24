import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import { IsObjectId } from 'class-validator-mongo-object-id';

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

  @ApiProperty({ example: 'Object Id', description: 'Район участника' })
  @IsObjectId()
  district: ObjectId;

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