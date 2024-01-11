import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateVideoDto {
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