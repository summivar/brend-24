import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';
import { IsObjectId } from 'class-validator-mongo-object-id';

export class EditPhotoDto {
  @ApiProperty({ example: 'Подпись к фото', description: 'Подпись к фото', required: false })
  @IsString()
  @IsOptional()
  photoCaption: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Фото',
    required: false,
  })
  @IsOptional()
  image: Express.Multer.File;
}