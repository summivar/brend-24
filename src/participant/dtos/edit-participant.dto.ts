import { IsBoolean, IsBooleanString, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import { IsObjectId } from 'class-validator-mongo-object-id';

export class EditParticipantDto {
  @ApiProperty({example: 'id', description: 'ID бренда'})
  @IsObjectId({message: 'Cannot transform string to ObjectID'})
  id: ObjectId;

  @ApiProperty({example: 'Tutu', description: 'Имя бренда'})
  @IsString()
  @IsOptional()
  nameOfBrand: string;

  @ApiProperty({example: 'TutuCompany', description: 'Имя компании'})
  @IsString()
  @IsOptional()
  nameOfCompany: string;

  @ApiProperty({example: 'State, region...', description: 'Адрес участника'})
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty({example: 'Some text..', description: 'Описание участника'})
  @IsString()
  @IsOptional()
  definition: string;

  @ApiProperty({description: 'Является ли участник партнёром?'})
  @IsBooleanString()
  @IsOptional()
  isPartner: boolean;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Лого участника',
    required: true,
  })
  logo: Express.Multer.File;
}