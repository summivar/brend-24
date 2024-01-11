import { Module } from '@nestjs/common';
import { PhotoController } from './photo.controller';
import { PhotoService } from './photo.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Photo, PhotoSchema } from './schemas';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Photo.name,
        schema: PhotoSchema,
      },
    ]),
    CommonModule
  ],
  controllers: [PhotoController],
  providers: [PhotoService],
})
export class PhotoModule {
}
