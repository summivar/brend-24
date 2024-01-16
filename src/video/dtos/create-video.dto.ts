import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString } from 'class-validator';

export class CreateVideoDto {
  @ApiProperty({ example: '2024-01-11T11:43:15+0000', description: 'Время видео' })
  @IsDateString({
    strict: true,
    strictSeparator: true,
  })
  videoTime: Date;

  @ApiProperty({ example: 'Подпись к видео', description: 'Подпись к видео', required: true })
  @IsString()
  videoCaption: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Видео',
    required: true,
  })
  video: Express.Multer.File;
}