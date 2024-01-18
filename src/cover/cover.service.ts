import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cover } from './schemas';
import { Model } from 'mongoose';
import { EXCEPTION_MESSAGE, UNIQUAL_ID_CONSTANTS } from '../constants';
import { FileSystemService } from '../common/file-system/file-system.service';

@Injectable()
export class CoverService {
  constructor(
    @InjectModel(Cover.name) private coverModel: Model<Cover>,
    private fileService: FileSystemService,
  ) {
    const cover = new this.coverModel({
      uniqueId: UNIQUAL_ID_CONSTANTS.COVER_ID,
    });

    cover.save().catch((e) => {
      if (e.toString().includes('E11000')) {
        return;
      }
      console.log(e.toString());
    });
  }

  async get() {
    return this.coverModel.findOne({ uniqueId: UNIQUAL_ID_CONSTANTS.COVER_ID });
  }

  async addPhotosToCover(photos: Array<Express.Multer.File>) {
    if (!photos.length) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NO_PHOTOS);
    }

    const cover = await this.coverModel.findOne({ uniqueId: UNIQUAL_ID_CONSTANTS.COVER_ID });
    if (!cover) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.SOMETHING_GO_WRONG);
    }

    const paths: string[] = [];

    for (const photo of photos) {
      const path = this.fileService.saveFile(photo);
      paths.push(path);
    }

    cover.photosPath = cover.photosPath.concat(paths);

    return cover.save();
  }

  async deletePhoto(index: number) {
    const cover = await this.coverModel.findOne({ uniqueId: UNIQUAL_ID_CONSTANTS.COVER_ID });
    if (index < 0 || index > cover.photosPath.length - 1) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.INVALID_DATA);
    }

    const removedPhotoPath = cover.photosPath.splice(index, 1)[0];

    this.fileService.deleteFile(removedPhotoPath);

    return cover.save();
  }
}
