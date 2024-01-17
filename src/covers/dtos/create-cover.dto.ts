import { ApiProperty } from '@nestjs/swagger';

export class CreateCoverDto {
  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    description: 'Array of photo files',
    required: true,
  })
  photos: Express.Multer.File[];
}