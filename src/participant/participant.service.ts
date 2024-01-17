import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Participant } from './schemas';
import { Model, ObjectId } from 'mongoose';
import { EXCEPTION_MESSAGE } from '../constants';
import { CreateParticipantDto, EditParticipantDto } from './dtos';
import { FileSystemService } from '../common/file-system/file-system.service';

@Injectable()
export class ParticipantService {
  constructor(
    @InjectModel(Participant.name) private participantModel: Model<Participant>,
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

  async getAllParticipants(pageSize?: number, pageNumber?: number) {
    if (pageSize && pageNumber) {
      const skip = pageSize * (pageNumber - 1);
      const totalParticipants = await this.participantModel.countDocuments();
      const paginatedParticipants = await this.participantModel.find()
        .skip(skip)
        .limit(pageSize)
        .exec();

      return {
        totalParticipants: totalParticipants,
        participants: paginatedParticipants,
      };
    }
    return {
      participants: await this.participantModel.find(),
    };
  }

  async create(dto: CreateParticipantDto, logo: Express.Multer.File) {
    const logoPath = this.fileService.saveFile(logo);
    const participant = new this.participantModel({
      nameOfBrand: dto.nameOfBrand,
      nameOfCompany: dto.nameOfCompany,
      address: dto.address,
      district: dto.district,
      definition: dto.description,
      logoPath: logoPath,
    });
    return participant.save().catch((e) => {
      if (e.toString().includes('E11000')) {
        throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.ALREADY_EXISTS);
      }
    });
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
      participant.district = dto.district;
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

  async deleteAllParticipants() {
    const participants = await this.participantModel.find();
    if (!participants) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND);
    }

    for (const participant of participants) {
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
    return this.participantModel.deleteOne(id);
  }
}
