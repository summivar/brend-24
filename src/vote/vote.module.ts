import { Module } from '@nestjs/common';
import { VoteService } from './vote.service';
import { VoteController } from './vote.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Vote, VoteSchema } from './schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Vote.name,
        schema: VoteSchema,
      },
    ]),
  ],
  providers: [VoteService],
  controllers: [VoteController],
})
export class VoteModule {
}
