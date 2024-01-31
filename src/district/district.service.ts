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

  async getDistrictByName(name: string) {
    return this.districtModel.findOne({ name: name });
  }

  async createDistrict(name: string) {
    const district = new this.districtModel({
      name: name.trim(),
    });

    return district.save().catch((e) => {
      if (e.toString().includes('E11000')) {
        throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.ALREADY_EXISTS);
      }
      throw new BadRequestException(e.toString());
    });
  }

  async checkDistrictExists(id: ObjectId) {
    const foundDistrict = await this.districtModel.findById(id);
    if (!foundDistrict) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID);
    }
    return foundDistrict;
  }

  async edit(id: ObjectId, newName: string) {
    const district = await this.districtModel.findById(id);
    if (!district) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID);
    }
    district.name = newName.trim();
    return district.save();
  }

  async updateParticipantInDistrict(idParticipant: ObjectId, idDistrict: ObjectId) {
    const district = await this.districtModel.findById(idDistrict);
    if (!district) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID);
    }
    if (!district.participants.includes(idParticipant)) {
      district.participants.push(idParticipant);
    }
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

  async deleteDistrictById(idDistrict: ObjectId) {
    const district = await this.districtModel.findById(idDistrict);
    if (!district) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID);
    }

    // await this.participantService.deleteDistrictFromParticipant(district._id);
    return this.districtModel.deleteOne(idDistrict);
  }

  async deleteParticipantFromDistrict(idDistrict: ObjectId, idParticipant: ObjectId) {
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
