import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileSystemService } from '../common/file-system/file-system.service';
import { EXCEPTION_MESSAGE, UNIQUAL_ID_CONSTANTS } from '../constants';
import { ApplicationLBK, ApplicationLBMO } from './schemas';

@Injectable()
export class ApplicationService {
  constructor(
    private fileService: FileSystemService,
    @InjectModel(ApplicationLBK.name) private lbkModel: Model<ApplicationLBK>,
    @InjectModel(ApplicationLBMO.name) private lbmoModel: Model<ApplicationLBMO>,
  ) {
  }

  async getLBK() {
    return this.lbkModel.findOne({ uniqueId: UNIQUAL_ID_CONSTANTS.APPLICATION_LBK_ID });
  }

  async getLBMO() {
    return this.lbmoModel.findOne({ uniqueId: UNIQUAL_ID_CONSTANTS.APPLICATION_LBMO_ID });
  }

  async createLBK(file: Express.Multer.File) {
    if (!file?.buffer) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.INVALID_DATA);
    }
    const lbk = await this.lbkModel.findOne({ uniqueId: UNIQUAL_ID_CONSTANTS.APPLICATION_LBK_ID });
    if (lbk) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.ALREADY_EXISTS);
    }

    const filePath = this.fileService.saveFile(file, 'lbk');
    const newLBK = new this.lbkModel({
      uniqueId: UNIQUAL_ID_CONSTANTS.APPLICATION_LBK_ID,
      filePath: filePath,
    });

    return newLBK.save().catch((e) => {
      if (e.toString().includes('E11000')) {
        throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.ALREADY_EXISTS);
      }
      throw new BadRequestException(e.toString());
    });
  }

  async createLBMO(file: Express.Multer.File) {
    if (!file?.buffer) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.INVALID_DATA);
    }
    const lbmo = await this.lbkModel.findOne({ uniqueId: UNIQUAL_ID_CONSTANTS.APPLICATION_LBMO_ID });
    if (lbmo) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.ALREADY_EXISTS);
    }

    const filePath = this.fileService.saveFile(file, 'lbmo');
    const newLBMO = new this.lbkModel({
      uniqueId: UNIQUAL_ID_CONSTANTS.APPLICATION_LBMO_ID,
      filePath: filePath,
    });

    return newLBMO.save().catch((e) => {
      if (e.toString().includes('E11000')) {
        throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.ALREADY_EXISTS);
      }
      throw new BadRequestException(e.toString());
    });
  }

  async editLBK(file: Express.Multer.File) {
    const lbk = await this.lbkModel.findOne({ uniqueId: UNIQUAL_ID_CONSTANTS.APPLICATION_LBK_ID });
    if (!lbk) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND);
    }

    this.fileService.deleteFile(lbk.filePath);
    lbk.filePath = this.fileService.saveFile(file, 'lbk');

    return lbk.save();
  }

  async editLBMO(file: Express.Multer.File) {
    const lbmo = await this.lbmoModel.findOne({ uniqueId: UNIQUAL_ID_CONSTANTS.APPLICATION_LBMO_ID });
    if (!lbmo) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND);
    }

    this.fileService.deleteFile(lbmo.filePath);
    lbmo.filePath = this.fileService.saveFile(file, 'lbmo');

    return lbmo.save();
  }

  async deleteLBK() {
    const lbk = await this.lbkModel.find({});
    if (lbk.length) {
      for (const value of lbk) {
        this.fileService.deleteFile(value.filePath);
      }
    }
    return this.lbkModel.deleteMany({});
  }

  async deleteLBMO() {
    const lbmo = await this.lbmoModel.find({});
    if (lbmo.length) {
      for (const value of lbmo) {
        this.fileService.deleteFile(value.filePath);
      }
    }
    return this.lbmoModel.deleteMany({});
  }
}
