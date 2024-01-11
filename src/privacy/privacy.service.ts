import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Privacy } from './schemas';
import { Model } from 'mongoose';
import { EXCEPTION_MESSAGE, UNIQUAL_ID_CONSTANTS } from '../constants';
import { CreatePrivacyDto, EditPrivacyDto } from './dtos';

@Injectable()
export class PrivacyService {
  constructor(@InjectModel(Privacy.name) private privacyModel: Model<Privacy>) {
  }

  async get() {
    return this.privacyModel.findOne({ uniqueId: UNIQUAL_ID_CONSTANTS.PRIVACY_ID });
  }

  async create(dto: CreatePrivacyDto) {
    const privacy = new this.privacyModel({ uniqueId: UNIQUAL_ID_CONSTANTS.PRIVACY_ID, text: dto.text });
    return privacy.save().catch((e) => {
      if (e.toString().includes('E11000')) {
        throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.ALREADY_EXISTS);
      }
    });
  }

  async edit(dto: EditPrivacyDto) {
    const privacy = await this.privacyModel.findOne({ uniqueId: UNIQUAL_ID_CONSTANTS.PRIVACY_ID });
    if (!privacy) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND);
    }
    privacy.text = dto.newText;
    return privacy.save();
  }
}
