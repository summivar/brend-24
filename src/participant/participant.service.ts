import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Participant } from './schemas';
import { Model, ObjectId, Types } from 'mongoose';
import { EXCEPTION_MESSAGE } from '../constants';
import { CreateParticipantDto, EditParticipantDto } from './dtos';
import { FileSystemService } from '../common/file-system/file-system.service';
import { DistrictService } from '../district/district.service';

@Injectable()
export class ParticipantService {
  constructor(
    @InjectModel(Participant.name) private participantModel: Model<Participant>,
    private districtService: DistrictService,
    private fileService: FileSystemService,
  ) {
  }

  async getParticipantBy(name?: string, id?: ObjectId) {
    if (!name && !id) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.INVALID_DATA);
    }

    if (name) {
      const regex = new RegExp(name, 'i');
      const participantBySlug = await this.participantModel.findOne({ nameOfCompany: { $regex: regex } });
      if (!participantBySlug) {
        throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND);
      }
      return participantBySlug;
    }

    if (id) {
      const participantById = await this.participantModel.findById(id);
      if (!participantById) {
        throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID);
      }
      return participantById;
    }
  }

  async getAllParticipantsByDistrictId(id: Types.ObjectId) {
    const participants = [];
    const participantsId = await this.districtService.getAllParticipantsIdByDistrictId(id);
    for (const participantId of participantsId) {
      const participant = await this.participantModel.findById(participantId);
      if (participant) {
        participants.push(participant);
      }
    }
    return participants;
  }

  async getAllParticipants(pageSize?: number, pageNumber?: number, sort?: boolean) {
    if (pageSize && pageNumber) {
      if (pageSize < 1 || pageNumber < 1) {
        throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.INVALID_DATA);
      }
      const skip = pageSize * (pageNumber - 1);
      const totalParticipants = await this.participantModel.countDocuments();
      const paginatedParticipants = await this.participantModel.find()
        .skip(skip)
        .limit(pageSize)
        .exec();

      return {
        totalParticipants: totalParticipants,
        participants: this.getSortedParticipants(paginatedParticipants, sort),
      };
    }
    return {
      participants: this.getSortedParticipants(await this.participantModel.find(), sort),
    };
  }

  async create(dto: CreateParticipantDto, logo: Express.Multer.File) {
    const logoPath = this.fileService.saveFile(logo);
    const district = await this.districtService.checkDistrictExists(dto.district);
    if (!district) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.DISTRICT_NO_EXISTS);
    }
    const newParticipant = new this.participantModel({
      nameOfBrand: dto.nameOfBrand,
      nameOfCompany: dto.nameOfCompany,
      description: dto.description,
      address: dto.address,
      district: dto.district,
      definition: dto.description,
      logoPath: logoPath,
    });
    const participant = await newParticipant.save().catch((e) => {
      if (e.toString().includes('E11000')) {
        throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.ALREADY_EXISTS);
      }
      throw new BadRequestException(e.toString());
    });
    if (participant) {
      await this.districtService.updateParticipantInDistrict(participant.id, dto.district);
    }
    return participant;
  }

  async edit(dto: EditParticipantDto, logo: Express.Multer.File, id: ObjectId) {
    const participant = await this.participantModel.findById(id);
    if (!participant) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID);
    }

    if (dto.nameOfBrand) {
      participant.nameOfBrand = dto.nameOfBrand;
    }

    if (dto.nameOfCompany) {
      participant.nameOfCompany = dto.nameOfCompany;
    }

    if (dto.address) {
      participant.address = dto.address;
    }

    if (dto.district) {
      const district = await this.districtService.checkDistrictExists(dto.district);
      if (!district) {
        throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.DISTRICT_NO_EXISTS);
      }

      await this.districtService.deleteParticipantFromDistrict(
        participant.district,
        participant.id,
      );

      participant.district = district.id;

      await this.districtService.updateParticipantInDistrict(participant.id, dto.district);
    }

    if (dto.description) {
      participant.description = dto.description;
    }

    if (logo) {
      const newLogoPath = this.fileService.saveFile(logo);
      this.fileService.deleteFile(participant.logoPath);
      participant.logoPath = newLogoPath;
    }

    return participant.save();
  }

  async deleteDistrictFromParticipant(idDistrict: Types.ObjectId) {
    return this.participantModel.findOneAndUpdate({ district: idDistrict }, {
      district: undefined,
    });
  }

  async deleteAllParticipants() {
    const participants = await this.participantModel.find();
    if (!participants) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND);
    }

    for (const participant of participants) {
      this.fileService.deleteFile(participant.logoPath);
      await this.districtService.deleteParticipantFromDistrict(participant.district, participant.id);
    }

    return this.participantModel.deleteMany();
  }

  async deleteParticipantById(id: ObjectId) {
    const participant = await this.participantModel.findById(id);
    if (!participant) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID);
    }

    this.fileService.deleteFile(participant.logoPath);
    await this.districtService.deleteParticipantFromDistrict(participant.district, participant.id);

    return this.participantModel.deleteOne(id);
  }

  private getSortedParticipants = (participants: any, sort?: boolean) => {
    return sort ? participants.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) : participants;
  };
}
