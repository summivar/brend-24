import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Participant } from './schemas';
import { Model, ObjectId } from 'mongoose';
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
      const participantsBySlug = await this.participantModel.find({nameOfCompany: {$regex: regex}});
      if (!participantsBySlug) {
        throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND);
      }
      return {
        participants: participantsBySlug,
      };
    }

    if (id) {
      const participantById = await this.participantModel.findById(id);
      if (!participantById) {
        throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID);
      }
      return participantById;
    }
  }

  async getAllParticipantsByDistrictId(id?: ObjectId) {
    if (!id) {
      return [];
    }
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
    const participants = this.getSortedParticipants(await this.participantModel.find(), sort);

    if (pageSize && pageNumber) {
      if (pageSize < 1 || pageNumber < 1) {
        throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.INVALID_DATA);
      }

      const skip = pageSize * (pageNumber - 1);
      const paginatedParticipants = participants.slice(skip, skip + pageSize);

      return {
        totalParticipants: participants.length,
        participants: paginatedParticipants,
      };
    }

    return {
      participants,
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

    if (logo?.buffer) {
      const newLogoPath = this.fileService.saveFile(logo);
      this.fileService.deleteFile(participant.logoPath);
      participant.logoPath = newLogoPath;
    }

    return participant.save();
  }

  async deleteDistrictFromParticipant(idDistrict: ObjectId) {
    const participants = await this.participantModel.find({district: idDistrict});
    if (participants) {
      for (const participant of participants) {
        participant.district = null;
        await participant.save();
      }
    }
  }

  async deleteAllParticipants() {
    const participants = await this.participantModel.find();
    if (!participants) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND);
    }

    for (const participant of participants) {
      await this.districtService.deleteParticipantFromDistrict(participant.district, participant.id);
      this.fileService.deleteFile(participant.logoPath);
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
