import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';
import { IsObjectId } from 'class-validator-mongo-object-id';

export class EditVideoDto {
  @ApiProperty({ example: '2024-01-11T11:43:15+0000', description: 'Время видео' })
  @IsDateString({
    strict: true,
    strictSeparator: true,
  })
  @IsOptional()
  videoTime: Date;

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