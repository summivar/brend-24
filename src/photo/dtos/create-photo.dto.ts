import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePhotoDto {
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