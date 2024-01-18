import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { FileSystemService } from '../common/file-system/file-system.service';
import { News } from './schemas';
import { CreateNewsDto, EditNewsDto } from './dtos';
import { EXCEPTION_MESSAGE } from '../constants';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name) private newsModel: Model<News>,
    private fileService: FileSystemService,
  ) {
  }

  async getAllNews() {
    const news = await this.newsModel.find();
    return news.sort((a: any, b: any) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });
  }

  async getBy(slug?: string, id?: ObjectId) {
    if (!slug && !id) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.INVALID_DATA);
    }

    if (slug) {
      const newsBySlug = await this.newsModel.findOne({ slug: slug });
      if (!newsBySlug) {
        throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND);
      }
      return newsBySlug;
    }

    if (id) {
      const newsById = await this.newsModel.findById(id);
      if (!newsById) {
        throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID);
      }
      return newsById;
    }
  }

  async create(dto: CreateNewsDto, image: Express.Multer.File) {
    const photoPath = this.fileService.saveFile(image);
    const news = new this.newsModel({
      name: dto.name,
      slug: dto.slug,
      photoPath: photoPath,
      photoCaption: dto.photoCaption,
      newsText: dto.newsText,
    });

    return news.save().catch((e) => {
      if (e.toString().includes('E11000')) {
        throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.ALREADY_EXISTS);
      }
      throw new BadRequestException(e.toString());
    });
  }

  async edit(dto: EditNewsDto, image: Express.Multer.File, id: ObjectId) {
    const news = await this.newsModel.findById(id);

    if (!news) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID);
    }

    if (dto.name) {
      news.name = dto.name;
    }

    if (dto.slug) {
      news.slug = dto.slug;
    }

    if (dto.photoCaption) {
      news.photoCaption = dto.photoCaption;
    }

    if (dto.newsText) {
      news.newsText = dto.newsText;
    }

    if (image) {
      const newPhotoPath = this.fileService.saveFile(image);
      this.fileService.deleteFile(news.photoPath);
      news.photoPath = newPhotoPath;
    }

    return news.save();
  }

  async deleteById(id: ObjectId) {
    const news = await this.newsModel.findById(id);
    if (!news) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID);
    }
    this.fileService.deleteFile(news.photoPath);
    return this.newsModel.deleteOne(id);
  }
}
