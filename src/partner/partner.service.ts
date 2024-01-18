import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Partner } from './schemas';
import { Model, ObjectId } from 'mongoose';
import { EXCEPTION_MESSAGE } from '../constants';
import { CreatePartnerDto, EditPartnerDto } from './dtos';
import { FileSystemService } from '../common/file-system/file-system.service';

@Injectable()
export class PartnerService {
  constructor(
    private fileService: FileSystemService,
    @InjectModel(Partner.name) private partnerModel: Model<Partner>,
  ) {
  }

  async getAll(pageSize?: number, pageNumber?: number) {
    if (pageSize && pageNumber) {
      if (pageSize < 1 || pageNumber < 1) {
        throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.INVALID_DATA)
      }
      const skip = pageSize * (pageNumber - 1);
      const totalPartners = await this.partnerModel.countDocuments();
      const paginatedPartners = await this.partnerModel.find()
        .skip(skip)
        .limit(pageSize)
        .exec();

      return {
        totalPartners: totalPartners,
        partners: paginatedPartners,
      };
    }
    return {
      partners: await this.partnerModel.find(),
    };
  }

  async getById(id: ObjectId) {
    const partnerById = await this.partnerModel.findById(id);
    if (!partnerById) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID);
    }
    return partnerById;
  }

  async create(dto: CreatePartnerDto, logo: Express.Multer.File) {
    const logoPath = this.fileService.saveFile(logo);
    const partner = new this.partnerModel({
      nameOfCompany: dto.nameOfCompany,
      description: dto.description,
      logoPath: logoPath,
    });

    return partner.save().catch((e) => {
      if (e.toString().includes('E11000')) {
        throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.ALREADY_EXISTS);
      }
      throw new BadRequestException(e.toString());
    });
  }

  async edit(dto: EditPartnerDto, logo: Express.Multer.File, id: ObjectId) {
    const partner = await this.partnerModel.findById(id);
    if (!partner) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID);
    }

    if (dto.nameOfCompany) {
      partner.nameOfCompany = dto.nameOfCompany;
    }

    if (dto.description) {
      partner.description = dto.description;
    }

    if (logo) {
      const newLogoPath = this.fileService.saveFile(logo);
      this.fileService.deleteFile(partner.logoPath);
      partner.logoPath = newLogoPath;
    }

    return partner.save();
  }

  async deleteById(id: ObjectId) {
    const partner = await this.partnerModel.findById(id);
    if (!partner) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID);
    }

    this.fileService.deleteFile(partner.logoPath);
    return this.partnerModel.deleteOne(id);
  }

  async deleteAll() {
    const partners = await this.partnerModel.find();
    if (!partners) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND);
    }

    for (const partner of partners) {
      this.fileService.deleteFile(partner.logoPath);
    }

    return this.partnerModel.deleteMany();
  }
}
