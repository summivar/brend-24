import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Video } from './schemas';
import { CreateVideoDto, EditVideoDto } from './dtos';
import { EXCEPTION_MESSAGE } from '../constants';
import { FileSystemService } from '../common/file-system/file-system.service';

@Injectable()
export class VideoService {
  constructor(
    @InjectModel(Video.name) private videoModel: Model<Video>,
    private fileService: FileSystemService,
  ) {
  }

  async getAll() {
    return this.videoModel.find();
  }

  async add(dto: CreateVideoDto, image: Express.Multer.File) {
    const videoPath = this.fileService.saveFile(image);
    const video = new this.videoModel({
      videoCaption: dto.videoCaption,
      videoPath: videoPath
    })

    return video.save().catch((e) => {
      if (e.toString().includes('E11000')) {
        throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.ALREADY_EXISTS);
      }
    });
  }

  async edit(dto: EditVideoDto, videoFile: Express.Multer.File, id: ObjectId) {
    const video = await this.videoModel.findById(id);

    if (!video) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID);
    }

    if (dto.videoCaption) {
      video.videoCaption = dto.videoCaption;
    }

    if (videoFile) {
      const newVideoPath = this.fileService.saveFile(videoFile);
      this.fileService.deleteFile(video.videoPath);
      video.videoPath = newVideoPath;
    }

    return video.save();
  }

  async deleteById(id: ObjectId) {
    const video = await this.videoModel.findById(id);
    if (!video) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID);
    }
    this.fileService.deleteFile(video.videoPath);
    return this.videoModel.deleteOne(id);
  }

  async deleteAll() {
    const videos = await this.videoModel.find();
    if (!videos) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND);
    }

    for (const video of videos) {
      this.fileService.deleteFile(video.videoPath);
    }

    return this.videoModel.deleteMany();
  }
}
