import { Module } from '@nestjs/common';
import { CommissionController } from './commission.controller';
import { CommissionService } from './commission.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Commission, CommissionSchema } from './schemas';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Commission.name,
        schema: CommissionSchema,
      },
    ]),
    CommonModule,
  ],
  controllers: [CommissionController],
  providers: [CommissionService],
})
export class CommissionModule {
}
