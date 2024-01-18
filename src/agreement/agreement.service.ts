import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Agreement } from './schemas';
import { Model } from 'mongoose';
import { EXCEPTION_MESSAGE, UNIQUAL_ID_CONSTANTS } from '../constants';
import { CreateAgreementDto, EditAgreementDto } from './dtos';

@Injectable()
export class AgreementService {
  constructor(@InjectModel(Agreement.name) private agreementModel: Model<Agreement>) {
  }

  async get() {
    return this.agreementModel.findOne({ uniqueId: UNIQUAL_ID_CONSTANTS.AGREEMENT_ID });
  }

  async create(dto: CreateAgreementDto) {
    const privacy = new this.agreementModel({ uniqueId: UNIQUAL_ID_CONSTANTS.AGREEMENT_ID, text: dto.text });
    return privacy.save().catch((e) => {
      if (e.toString().includes('E11000')) {
        throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.ALREADY_EXISTS);
      }
      throw new BadRequestException(e.toString());
    });
  }

  async edit(dto: EditAgreementDto) {
    const agreement = await this.agreementModel.findOne({ uniqueId: UNIQUAL_ID_CONSTANTS.AGREEMENT_ID });
    if (!agreement) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND);
    }
    agreement.text = dto.newText;
    return agreement.save();
  }
}
