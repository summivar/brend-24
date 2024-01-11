import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Photo } from './schemas';
import { CreatePhotoDto, EditPhotoDto } from './dtos';
import { EXCEPTION_MESSAGE } from '../constants';
import { FileSystemService } from '../common/file-system/file-system.service';

@Injectable()
export class PhotoService {
  constructor(
    @InjectModel(Photo.name) private photoModel: Model<Photo>,
    private fileService: FileSystemService,
  ) {
  }

  async getAll() {
    return this.photoModel.find();
  }

  async add(dto: CreatePhotoDto, image: Express.Multer.File) {
    const photoPath = this.fileService.saveFile(image);
    const photo = new this.photoModel({
      photoPath: photoPath,
      photoCaption: dto.photoCaption,
    });

    return photo.save().catch((e) => {
      if (e.toString().includes('E11000')) {
        throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.ALREADY_EXISTS);
      }
    });
  }

  async edit(dto: EditPhotoDto, image: Express.Multer.File) {
    const photo = await this.photoModel.findById(dto.id);

    if (!photo) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID);
    }

    if (dto.photoCaption) {
      photo.photoCaption = dto.photoCaption;
    }

    if (image) {
      const newPhotoPath = this.fileService.saveFile(image);
      this.fileService.deleteFile(photo.photoPath);
      photo.photoPath = newPhotoPath;
    }

    return photo.save();
  }

  async deleteById(id: ObjectId) {
    const photo = await this.photoModel.findById(id);
    if (!photo) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID);
    }
    this.fileService.deleteFile(photo.photoPath);
    return this.photoModel.deleteOne(id);
  }

  async deleteAll() {
    const photos = await this.photoModel.find();
    if (!photos) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND);
    }

    for (const photo of photos) {
      this.fileService.deleteFile(photo.photoPath);
    }

    return this.photoModel.deleteMany();
  }
}