import { IsDateString, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNewsDto {
  @ApiProperty({example: 'Name', description: 'Имя новости'})
  @IsString()
  name: string;

  @ApiProperty({example: 'Slug', description: 'Slug новости'})
  @IsString()
  slug: string;

  @ApiProperty({example: 'Photo caption', description: 'Подпись к фото новости'})
  @IsString()
  photoCaption: string;

  @ApiProperty({example: 'Tutu tutu tutu', description: 'Текст новости'})
  @IsString()
  newsText: string;

  @ApiProperty({ example: '2024-01-11T11:43:15+0000', description: 'Время новости' })
  @IsDateString({
    strict: true,
    strictSeparator: true,
  })
  newsDate: Date;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Фото новости',
    required: true,
  })
  image: Express.Multer.File;
}