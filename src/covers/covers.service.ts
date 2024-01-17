import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cover } from './schemas';
import { Model, ObjectId } from 'mongoose';
import { EXCEPTION_MESSAGE } from '../constants';
import { FileSystemService } from '../common/file-system/file-system.service';

@Injectable()
export class CoversService {
  constructor(
    @InjectModel(Cover.name) private coverModel: Model<Cover>,
    private fileService: FileSystemService,
  ) {
  }

  async getAll() {
    return this.coverModel.find();
  }

  async getById(id: ObjectId) {
    const cover = await this.coverModel.findById(id);
    if (!cover) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID);
    }
    return cover;
  }

  async create(photos: Array<Express.Multer.File>) {
    if (!photos.length) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NO_PHOTOS);
    }
    const paths: string[] = [];
    for (const photo of photos) {
      const path = this.fileService.saveFile(photo);
      paths.push(path);
    }

    const cover = new this.coverModel({
      photosPath: paths,
    });

    return cover.save();
  }

  async addPhotosToCover(id: ObjectId, photos: Array<Express.Multer.File>) {
    if (!photos.length) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NO_PHOTOS);
    }
    const cover = await this.coverModel.findById(id);
    if (!cover) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID);
    }
    const paths: string[] = [];
    for (const photo of photos) {
      const path = this.fileService.saveFile(photo);
      paths.push(path);
    }
    cover.photosPath = cover.photosPath.concat(paths);

    return cover.save();
  }

  async deleteById(id: ObjectId) {
    const cover = await this.coverModel.findById(id);
    if (!cover) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID);
    }

    if (cover.photosPath.length) {
      for (const photoPath of cover.photosPath) {
        this.fileService.deleteFile(photoPath);
      }
    }

    return this.coverModel.deleteOne(id);
  }

  async deleteAll() {
    const covers = await this.coverModel.find();
    if (covers.length) {
      for (const cover of covers) {
        for (const photoPath of cover.photosPath) {
          this.fileService.deleteFile(photoPath);
        }
      }
    }

    return this.coverModel.deleteMany();
  }
}
