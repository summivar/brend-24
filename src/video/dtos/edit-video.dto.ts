import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';
import { IsObjectId } from 'class-validator-mongo-object-id';

export class EditVideoDto {
  @ApiProperty({ example: 'Подпись к видео', description: 'Подпись к видео', required: false })
  @IsString()
  @IsOptional()
  videoCaption: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Видео',
    required: false,
  })
  @IsOptional()
  video: Express.Multer.File;
}