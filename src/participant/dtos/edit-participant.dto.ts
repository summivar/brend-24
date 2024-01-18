import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';

export class EditParticipantDto {
  @ApiProperty({ example: 'Tutu', description: 'Имя бренда', required: false })
  @IsString()
  @IsOptional()
  nameOfBrand: string;

  @ApiProperty({ example: 'TutuCompany', description: 'Имя компании', required: false })
  @IsString()
  @IsOptional()
  nameOfCompany: string;

  @ApiProperty({ example: 'State, region...', description: 'Адрес участника', required: false })
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty({ example: 'Object ID', description: 'Район участника', required: false })
  @IsString()
  @IsOptional()
  district: ObjectId;

  @ApiProperty({ example: 'Some text..', description: 'Описание участника', required: false })
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