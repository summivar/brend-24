import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Vote } from './schemas';
import { Model } from 'mongoose';
import { EXCEPTION_MESSAGE, UNIQUAL_ID_CONSTANTS } from '../constants';
import { CreateVoteDto, EditVoteDto } from './dtos';

@Injectable()
export class VoteService {
  constructor(
    @InjectModel(Vote.name) private voteModel: Model<Vote>,
  ) {
  }

  async get() {
    return this.voteModel.findOne({ uniqueId: UNIQUAL_ID_CONSTANTS.VOTE_ID });
  }


  async create(dto: CreateVoteDto) {
    const vote = new this.voteModel({
      uniqueId: UNIQUAL_ID_CONSTANTS.VOTE_ID,
      link: dto.link,
      votingId: dto.votingId,
      isEnabled: dto.isEnabled,
    });
    return vote.save().catch((e) => {
      if (e.toString().includes('E11000')) {
        throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.ALREADY_EXISTS);
      }
      throw new BadRequestException(e.toString());
    });
  }


  async edit(dto: EditVoteDto) {
    const vote = await this.voteModel.findOne({ uniqueId: UNIQUAL_ID_CONSTANTS.VOTE_ID });
    if (!vote) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND);
    }

    if (dto.link) {
      vote.link = dto.link;
    }

    if (dto.votingId) {
      vote.votingId = dto.votingId;
    }

    if (dto.isEnabled !== undefined) {
      vote.isEnabled = dto.isEnabled;
    }

    return vote.save();
  }
}
