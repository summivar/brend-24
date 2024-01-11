import { Module } from '@nestjs/common';
import { ParticipantService } from './participant.service';
import { ParticipantController } from './participant.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Participant, ParticipantSchema } from './schemas';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Participant.name,
        schema: ParticipantSchema,
      },
    ]),
    CommonModule
  ],
  providers: [ParticipantService],
  controllers: [ParticipantController],
})
export class ParticipantModule {
}
