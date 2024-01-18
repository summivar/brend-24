import { ApiProperty } from '@nestjs/swagger';

export class AddPhotosCoverDto {
  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
  })
  photos: Array<Express.Multer.File>;
}