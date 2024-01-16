import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import { IsObjectId } from 'class-validator-mongo-object-id';

export class EditNewsDto {
  @ApiProperty({example: 'Name', description: 'Имя новости'})
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({example: 'Slug', description: 'Slug новости'})
  @IsString()
  @IsOptional()
  slug: string;

  @ApiProperty({example: 'Photo caption', description: 'Подпись к фото новости'})
  @IsString()
  @IsOptional()
  photoCaption: string;

  @ApiProperty({example: 'Tutu tutu tutu', description: 'Текст новости'})
  @IsString()
  @IsOptional()
  newsText: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Фото новости',
    required: true,
  })
  @IsOptional()
  image: Express.Multer.File;
}