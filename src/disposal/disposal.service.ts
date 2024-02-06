import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Disposal } from './schemas';
import { Model } from 'mongoose';
import { FileSystemService } from '../common/file-system/file-system.service';
import { EXCEPTION_MESSAGE, UNIQUAL_ID_CONSTANTS } from '../constants';

@Injectable()
export class DisposalService {
  constructor(
    private fileService: FileSystemService,
    @InjectModel(Disposal.name) private disposalModel: Model<Disposal>,
  ) {
  }

  async get() {
    return this.disposalModel.findOne({uniqueId: UNIQUAL_ID_CONSTANTS.DISPOSAL_ID});
  }

  async create(file: Express.Multer.File) {
    if (!file?.buffer) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.INVALID_DATA);
    }
    const disposal = await this.disposalModel.findOne({uniqueId: UNIQUAL_ID_CONSTANTS.DISPOSAL_ID});
    if (disposal) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.ALREADY_EXISTS);
    }

    const filePath = this.fileService.saveFile(file, 'disposal');
    const newDisposal = new this.disposalModel({
      uniqueId: UNIQUAL_ID_CONSTANTS.DISPOSAL_ID,
      filePath: filePath,
    });

    return newDisposal.save().catch((e) => {
      if (e.toString().includes('E11000')) {
        throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.ALREADY_EXISTS);
      }
      throw new BadRequestException(e.toString());
    });
  }

  async edit(file: Express.Multer.File) {
    const disposal = await this.disposalModel.findOne({uniqueId: UNIQUAL_ID_CONSTANTS.DISPOSAL_ID});
    if (!disposal) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND);
    }

    this.fileService.deleteFile(disposal.filePath);
    disposal.filePath = this.fileService.saveFile(file, 'disposal');

    return disposal.save();
  }
}
