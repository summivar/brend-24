import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { About } from './schemas';
import { Model } from 'mongoose';
import { EXCEPTION_MESSAGE, UNIQUAL_ID_CONSTANTS } from '../constants';
import { CreateAboutDto, EditAboutDto } from './dtos';

@Injectable()
export class AboutService {
  constructor(@InjectModel(About.name) private aboutModel: Model<About>) {
  }

  async get() {
    return this.aboutModel.findOne({ uniqueId: UNIQUAL_ID_CONSTANTS.ABOUT_ID });
  }

  async create(dto: CreateAboutDto) {
    const about = new this.aboutModel({
      uniqueId: UNIQUAL_ID_CONSTANTS.ABOUT_ID,
      history: dto.history,
      forWhoThis: dto.forWhoThis,
      nominations: dto.nominations,
      invitation: dto.invitation,
      howToAccept: dto.howToAccept,
      termsOfParticipation: dto.termsOfParticipation
    });
    return about.save().catch((e) => {
      if (e.toString().includes('E11000')) {
        throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.ALREADY_EXISTS);
      }
      throw new BadRequestException(e.toString());
    });
  }

  async edit(dto: EditAboutDto) {
    const about = await this.aboutModel.findOne({ uniqueId: UNIQUAL_ID_CONSTANTS.ABOUT_ID });

    if (!about) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND);
    }

    if (dto.history) {
      about.history = dto.history;
    }

    if (dto.forWhoThis) {
      about.forWhoThis = dto.forWhoThis;
    }

    if (dto.nominations) {
      about.nominations = dto.nominations;
    }

    if (dto.invitation) {
      about.invitation = dto.invitation;
    }

    if (dto.howToAccept) {
      about.howToAccept = dto.howToAccept;
    }

    if (dto.termsOfParticipation) {
      about.termsOfParticipation = dto.termsOfParticipation;
    }

    return about.save();
  }
}
