import { Module } from '@nestjs/common';
import { DisposalController } from './disposal.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Disposal, DisposalSchema } from './schemas';
import { CommonModule } from '../common/common.module';
import { DisposalService } from './disposal.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Disposal.name,
        schema: DisposalSchema,
      },
    ]),
    CommonModule,
  ],
  controllers: [DisposalController],
  providers: [DisposalService],
})
export class DisposalModule {
}
