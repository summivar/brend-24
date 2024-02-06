import { ApiProperty } from '@nestjs/swagger';

export class CreateDisposalDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Файл',
    required: true,
  })
  file: Express.Multer.File;
}