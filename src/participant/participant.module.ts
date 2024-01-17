import { Module } from '@nestjs/common';
import { ParticipantService } from './participant.service';
import { ParticipantController } from './participant.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Participant, ParticipantSchema } from './schemas';
import { CommonModule } from '../common/common.module';
import { DistrictModule } from '../district/district.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Participant.name,
        schema: ParticipantSchema,
      },
    ]),
    CommonModule,
    DistrictModule
  ],
  providers: [ParticipantService],
  controllers: [ParticipantController],
})
export class ParticipantModule {
}
