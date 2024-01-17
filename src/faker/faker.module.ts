import { Module } from '@nestjs/common';
import { FakerController } from './faker.controller';
import { FakerService } from './faker.service';
import { EventModule } from '../event/event.module';
import { CommonModule } from '../common/common.module';
import { NewsModule } from '../news/news.module';
import { ParticipantModule } from '../participant/participant.module';

@Module({
  imports: [
    CommonModule,
    EventModule,
    NewsModule,
    ParticipantModule,
  ],
  controllers: [FakerController],
  providers: [FakerService]
})
export class FakerModule {}
