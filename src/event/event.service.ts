import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Event } from './schemas';
import { Model, ObjectId } from 'mongoose';
import { CreateEventDto, EditEventDto } from './dtos';
import { EXCEPTION_MESSAGE } from '../constants';

@Injectable()
export class EventService {
  constructor(@InjectModel(Event.name) private eventModel: Model<Event>) {
  }

  async getAll() {
    return this.eventModel.find();
  }

  async getById(id: ObjectId) {
    return this.eventModel.findOne(id);
  }

  async create(dto: CreateEventDto) {
    const event = new this.eventModel({
      name: dto.name,
      startTime: dto.startTime,
      endTime: dto.endTime,
      description: dto.description,
    });

    return event.save().catch((e) => {
      if (e.toString().includes('E11000')) {
        throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.ALREADY_EXISTS);
      }
      throw new BadRequestException(e.toString());
    });
  }

  async edit(dto: EditEventDto, id: ObjectId) {
    const event = await this.eventModel.findOne(id);
    if (!event) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID);
    }

    if (dto.name) {
      event.name = dto.name;
    }

    if (dto.startTime) {
      event.startTime = dto.startTime;
    }

    if (dto.endTime) {
      event.endTime = dto.endTime;
    }

    if (dto.description) {
      event.description = dto.description;
    }

    return event.save();
  }

  async deleteAll() {
    return this.eventModel.deleteMany();
  }

  async deleteById(id: ObjectId) {
    return this.eventModel.deleteOne(id);
  }
}
