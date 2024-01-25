import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Video } from './schemas';
import { CreateVideoDto, EditVideoDto } from './dtos';
import { EXCEPTION_MESSAGE } from '../constants';

@Injectable()
export class VideoService {
  constructor(
    @InjectModel(Video.name) private videoModel: Model<Video>,
  ) {
  }

  async getAll(pageSize: number, pageNumber: number) {
    let query = this.videoModel.find({});

    query = query.sort([['videoTime', -1]]);

    if (pageSize && pageNumber) {
      if (pageSize < 1 || pageNumber < 1) {
        throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.INVALID_DATA);
      }

      const skip = pageSize * (pageNumber - 1);
      query = query.skip(skip).limit(pageSize);
    }

    const totalVideos = await this.videoModel.countDocuments({});
    const videos = await query.exec();

    return {
      totalVideos: totalVideos,
      videos: videos,
    };
  }

  async edit(dto: EditVideoDto, id: ObjectId) {
    const video = await this.videoModel.findById(id);

    if (!video) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID);
    }

    if (dto.videoTime) {
      video.videoTime = dto.videoTime;
    }

    if (dto.videoCaption) {
      video.videoCaption = dto.videoCaption;
    }

    if (dto.videoLink) {
      video.videoLink = dto.videoLink;
    }

    return video.save();
  }

  async add(dto: CreateVideoDto) {
    const video = new this.videoModel({
      videoTime: dto.videoTime,
      videoCaption: dto.videoCaption,
      videoLink: dto.videoLink,
    });

    return video.save().catch((e) => {
      if (e.toString().includes('E11000')) {
        throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.ALREADY_EXISTS);
      }
      throw new BadRequestException(e.toString());
    });
  }

  async deleteById(id: ObjectId) {
    return this.videoModel.deleteOne(id);
  }

  async deleteAll() {
    return this.videoModel.deleteMany();
  }
}
