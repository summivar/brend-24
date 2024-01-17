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
  ) {
  }

  async getAll(pageSize: number, pageNumber: number) {
    if (pageSize && pageNumber) {
      const skip = pageSize * (pageNumber - 1);
      const totalVideos = await this.videoModel.countDocuments({});
      const paginatedVideos = await this.videoModel.find({})
        .skip(skip)
        .limit(pageSize)
        .exec();

      return {
        totalVideo: totalVideos,
        videos: paginatedVideos.sort((a, b) => {
          const dateA = new Date(a.videoTime).getTime();
          const dateB = new Date(b.videoTime).getTime();
          return dateB - dateA;
        }),
      };
    }
    const videos = await this.videoModel.find({});
    return {
      videos: videos.sort((a, b) => {
        const dateA = new Date(a.videoTime).getTime();
        const dateB = new Date(b.videoTime).getTime();
        return dateB - dateA;
      }),
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
      videoPath: dto.videoLink
    });

    return video.save().catch((e) => {
      if (e.toString().includes('E11000')) {
        throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.ALREADY_EXISTS);
      }
    });
  }

  async deleteById(id: ObjectId) {
    return this.videoModel.deleteOne(id);
  }

  async deleteAll() {
    return this.videoModel.deleteMany();
  }
}
