import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditNewsDto {
  @ApiProperty({example: 'Name', description: 'Имя новости', required: false})
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({example: 'Slug', description: 'Slug новости', required: false})
  @IsString()
  @IsOptional()
  slug: string;

  @ApiProperty({example: 'Photo caption', description: 'Подпись к фото новости', required: false})
  @IsString()
  @IsOptional()
  photoCaption: string;

  @ApiProperty({example: 'Tutu tutu tutu', description: 'Текст новости', required: false})
  @IsString()
  @IsOptional()
  newsText: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Фото новости',
    required: false,
  })
  @IsOptional()
  image: Express.Multer.File;
}