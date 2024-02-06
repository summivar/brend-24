import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Commission } from './schemas';
import { Model } from 'mongoose';
import { FileSystemService } from '../common/file-system/file-system.service';
import { EXCEPTION_MESSAGE, UNIQUAL_ID_CONSTANTS } from '../constants';

@Injectable()
export class CommissionService {
  constructor(
    private fileService: FileSystemService,
    @InjectModel(Commission.name) private commissionModel: Model<Commission>,
  ) {
  }

  async get() {
    return this.commissionModel.findOne({ uniqueId: UNIQUAL_ID_CONSTANTS.COMMISSION_ID });
  }

  async create(file: Express.Multer.File) {
    if (!file?.buffer) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.INVALID_DATA);
    }
    const commission = await this.commissionModel.findOne({ uniqueId: UNIQUAL_ID_CONSTANTS.COMMISSION_ID });
    if (commission) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.ALREADY_EXISTS);
    }

    const filePath = this.fileService.saveFile(file, 'commission');
    const newCommission = new this.commissionModel({
      uniqueId: UNIQUAL_ID_CONSTANTS.COMMISSION_ID,
      filePath: filePath,
    });

    return newCommission.save().catch((e) => {
      if (e.toString().includes('E11000')) {
        throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.ALREADY_EXISTS);
      }
      throw new BadRequestException(e.toString());
    });
  }

  async edit(file: Express.Multer.File) {
    const commission = await this.commissionModel.findOne({ uniqueId: UNIQUAL_ID_CONSTANTS.COMMISSION_ID });
    if (!commission) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND);
    }

    this.fileService.deleteFile(commission.filePath);
    commission.filePath = this.fileService.saveFile(file, 'commission');

    return commission.save();
  }
}
