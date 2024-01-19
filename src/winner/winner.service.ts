import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Winner } from './schemas';
import { Model, ObjectId } from 'mongoose';
import { CreateWinnerDto, EditWinnerDto } from './dtos';
import { EXCEPTION_MESSAGE } from '../constants';
import { FileSystemService } from '../common/file-system/file-system.service';

@Injectable()
export class WinnerService {
  constructor(
    private fileService: FileSystemService,
    @InjectModel(Winner.name) private winnerModel: Model<Winner>,
  ) {
  }

  async getAll() {
    return this.winnerModel.find();
  }

  async getById(id: ObjectId) {
    return this.winnerModel.findById(id);
  }

  async create(dto: CreateWinnerDto, file: Express.Multer.File) {
    if (!file.buffer) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.INVALID_DATA);
    }
    const filePath = this.fileService.saveFile(file);
    const winner = new this.winnerModel({
      nameFile: dto.name,
      filePath: filePath,
    });

    return winner.save().catch((e) => {
      if (e.toString().includes('E11000')) {
        throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.ALREADY_EXISTS);
      }
      throw new BadRequestException(e.toString());
    });
  }

  async edit(id: ObjectId, dto: EditWinnerDto, file: Express.Multer.File) {
    const winner = await this.winnerModel.findOne(id);
    if (!winner) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID);
    }

    if (dto.name) {
      winner.nameFile = dto.name;
    }

    if (file.buffer) {
      this.fileService.deleteFile(winner.filePath);
      winner.filePath = this.fileService.saveFile(file);
    }

    return winner.save();
  }

  async deleteAll() {
    const winners = await this.winnerModel.find();
    for (const winner of winners) {
      this.fileService.deleteFile(winner.filePath);
    }

    return this.winnerModel.deleteMany();
  }

  async deleteById(id: ObjectId) {
    const winner = await this.winnerModel.findById(id);
    if (!winner) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID);
    }

    this.fileService.deleteFile(winner.filePath);

    return this.winnerModel.deleteOne(id);
  }
}
