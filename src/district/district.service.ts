import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { District } from './schemas';
import { Model, ObjectId, Types } from 'mongoose';
import { EXCEPTION_MESSAGE } from '../constants';
import { ParticipantService } from '../participant/participant.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class DistrictService {
  constructor(
    @InjectModel(District.name) private districtModel: Model<District>,
    @Inject(forwardRef(() => UsersService)) private participantService: ParticipantService,
  ) {
  }

  async getAllParticipantsIdByDistrictId(id: Types.ObjectId) {
    const district = await this.districtModel.findById(id);
    if (!district) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID);
    }
    return district.participants;
  }

  async getAllDistricts() {
    return this.districtModel.find();
  }

  async getById(id: ObjectId) {
    return this.districtModel.findById(id);
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

  async edit(id: ObjectId, newName: string) {
    const district = await this.districtModel.findById(id);
    if (!district) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID);
    }
    district.name = newName;
    return district.save();
  }

  async updateParticipantInDistrict(idParticipant: Types.ObjectId, oldDistrict: Types.ObjectId, newDistrict: string) {
    const existedDistrict = await this.districtModel.findOne(oldDistrict);
    if (existedDistrict) {
      if (existedDistrict.participants.includes(idParticipant)) {
        existedDistrict.participants = existedDistrict.participants.filter(participantId => participantId !== idParticipant);
      }
    }
    const district = await this.getOrCreateDistrict(newDistrict);
    if (!district) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID);
    }
    if (!district.participants.includes(idParticipant)) {
      district.participants.push(idParticipant);
    }
    district.name = newDistrict.toLowerCase().trim();
    return district.save();
  }

  async deleteAllDistrict() {
    const districts = await this.districtModel.find();
    if (!districts) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND);
    }

    for (const district of districts) {
      await this.participantService.deleteDistrictFromParticipant(district._id);
    }

    return this.districtModel.deleteMany();
  }

  async deleteDistrictById(idDistrict: Types.ObjectId) {
    const district = await this.districtModel.findById(idDistrict);
    if (!district) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID);
    }

    await this.participantService.deleteDistrictFromParticipant(district._id);
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
