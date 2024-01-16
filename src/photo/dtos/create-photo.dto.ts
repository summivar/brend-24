import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreatePhotoDto {
  @ApiProperty({ example: '2024-01-11T11:43:15+0000', description: 'Время фотографии' })
  @IsDateString({
    strict: true,
    strictSeparator: true,
  })
  photoTime: Date;

  @ApiProperty({ example: 'Подпись к фото', description: 'Подпись к фото', required: true })
  @IsString()
  photoCaption: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Фото',
    required: true,
  })
  image: Express.Multer.File;
}