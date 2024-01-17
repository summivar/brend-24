import { forwardRef, Module } from '@nestjs/common';
import { DistrictController } from './district.controller';
import { DistrictService } from './district.service';
import { MongooseModule } from '@nestjs/mongoose';
import { District, DistrictSchema } from './schemas';
import { ParticipantModule } from '../participant/participant.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    CommonModule,
    MongooseModule.forFeature([
      {
        name: District.name,
        schema: DistrictSchema,
      },
    ]),
    forwardRef(() => ParticipantModule),
  ],
  providers: [DistrictService],
  exports: [
    DistrictService,
  ],
  controllers: [DistrictController],
})
export class DistrictModule {
}
