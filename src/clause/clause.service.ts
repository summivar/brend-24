import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Clause } from './schemas';
import { Model } from 'mongoose';
import { EXCEPTION_MESSAGE, UNIQUAL_ID_CONSTANTS } from '../constants';
import { FileSystemService } from '../common/file-system/file-system.service';

@Injectable()
export class ClauseService {
  constructor(
    private fileService: FileSystemService,
    @InjectModel(Clause.name) private clausModel: Model<Clause>,
  ) {
  }

  async get() {
    return this.clausModel.findOne({ uniqueId: UNIQUAL_ID_CONSTANTS.CLAUSE_ID });
  }

  async create(file: Express.Multer.File) {
    if (!file?.buffer) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.INVALID_DATA);
    }
    const clause = await this.clausModel.findOne({ uniqueId: UNIQUAL_ID_CONSTANTS.CLAUSE_ID });
    if (clause) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.ALREADY_EXISTS);
    }

    const filePath = this.fileService.saveFile(file, 'polozhenie');
    const newClause = new this.clausModel({
      uniqueId: UNIQUAL_ID_CONSTANTS.CLAUSE_ID,
      filePath: filePath,
    });

    return newClause.save().catch((e) => {
      if (e.toString().includes('E11000')) {
        throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.ALREADY_EXISTS);
      }
      throw new BadRequestException(e.toString());
    });
  }

  async edit(file: Express.Multer.File) {
    const clause = await this.clausModel.findOne({ uniqueId: UNIQUAL_ID_CONSTANTS.CLAUSE_ID });
    if (!clause) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND);
    }

    this.fileService.deleteFile(clause.filePath);
    clause.filePath = this.fileService.saveFile(file, 'polozhenie');

    return clause.save();
  }
}
