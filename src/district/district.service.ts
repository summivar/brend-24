import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { District } from './schemas';
import { Model, Types } from 'mongoose';
import { EXCEPTION_MESSAGE } from '../constants';

@Injectable()
export class DistrictService {
  constructor(
    @InjectModel(District.name) private districtModel: Model<District>,
  ) {
  }

  async getAllUsersIdByDistrictId(id: Types.ObjectId) {
    const district = await this.districtModel.findById(id);
    if (!district) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID);
    }
    return district.participants;
  }

  async getAllDistricts() {
    return this.districtModel.find();
  }

  async getOrCreateDistrict(district: string) {
    const foundDistrict = await this.districtModel.findOne({ name: district.toLowerCase().trim() });
    if (foundDistrict) {
      return foundDistrict;
    } else {
      const newDistrict = await this.districtModel.create({
        name: district.toLowerCase().trim(),
      });
      return newDistrict.save();
    }
  }

  async updateParticipantInDistrict(idParticipant: Types.ObjectId, idDistrict: Types.ObjectId, newDistrict: string) {
    const district = await this.districtModel.findById(idDistrict);
    if (!district) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID);
    }
    if (!district.participants.includes(idParticipant)) {
      district.participants.push(idParticipant);
    }
    district.name = newDistrict.toLowerCase().trim();
    return district.save();
  }

  async deleteDistrictById(idDistrict: Types.ObjectId) {
    return this.districtModel.deleteOne(idDistrict);
  }

  async deleteParticipantFromDistrict(idDistrict: Types.ObjectId, idParticipant: Types.ObjectId) {
    const district = await this.districtModel.findById(idDistrict);
    if (!district) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID);
    }

    if (district.participants && district.participants.includes(idParticipant)) {
      district.participants = district.participants.filter(participantId => participantId !== idParticipant);
    }

    return district.save();
  }
}
