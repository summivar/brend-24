import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';
import { IsObjectId } from 'class-validator-mongo-object-id';

export class EditVideoDto {
  @ApiProperty({ example: '2024-01-11T11:43:15+0000', description: 'Время видео', required: false })
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

  @ApiProperty({ example: 'https://youtu.be/dQw4w9WgXcQ?si=nBoSYq7ZWQoFwFVL', description: 'Ссылка на видео', required: true })
  @IsString()
  @IsOptional()
  videoLink: string;
}