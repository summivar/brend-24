import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Contacts } from './schemas';
import { Model } from 'mongoose';
import { EXCEPTION_MESSAGE, UNIQUAL_ID_CONSTANTS } from '../constants';
import { CreateContactsDto, EditContactsDto } from './dtos';

@Injectable()
export class ContactsService {
  constructor(@InjectModel(Contacts.name) private contactsModel: Model<Contacts>) {
  }

  async get() {
    const contact = this.contactsModel.findOne({ uniqueId: UNIQUAL_ID_CONSTANTS.CONTACTS_ID });
    if (!contact) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    contact.telegramLink = undefined;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return contact.save();
  }

  async create(dto: CreateContactsDto) {
    const contacts = new this.contactsModel({
      uniqueId: UNIQUAL_ID_CONSTANTS.CONTACTS_ID,
      address: dto.address,
      number: dto.number,
      email: dto.email,
      whatsappLink: dto.whatsappLink,
    });
    return contacts.save().catch((e) => {
      if (e.toString().includes('E11000')) {
        throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.ALREADY_EXISTS);
      }
      throw new BadRequestException(e.toString());
    });
  }

  async edit(dto: EditContactsDto) {
    const contacts = await this.contactsModel.findOne({ uniqueId: UNIQUAL_ID_CONSTANTS.CONTACTS_ID });

    if (!contacts) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND);
    }

    if (dto.address.length) {
      contacts.address = dto.address;
    }
    if (dto.number.length) {
      contacts.number = dto.number;
    }
    if (dto.email) {
      contacts.email = dto.email;
    }
    if (dto.whatsappLink) {
      contacts.whatsappLink = dto.whatsappLink;
    }

    return contacts.save();
  }
}
