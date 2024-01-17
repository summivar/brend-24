import { Module } from '@nestjs/common';
import { PartnerController } from './partner.controller';
import { PartnerService } from './partner.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from '../common/common.module';
import { Partner, PartnerSchema } from './schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Partner.name,
        schema: PartnerSchema,
      },
    ]),
    CommonModule,
  ],
  controllers: [PartnerController],
  providers: [PartnerService],
})
export class PartnerModule {
}
