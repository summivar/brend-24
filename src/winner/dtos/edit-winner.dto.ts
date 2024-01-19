import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class EditWinnerDto {
  @ApiProperty({ example: 'Name файла', description: 'Имя файла' })
  @IsString()
  name: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Файл',
    required: true,
  })
  file: Express.Multer.File;
}