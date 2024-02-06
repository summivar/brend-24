import { Module } from '@nestjs/common';
import { ApplicationController } from './application.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from '../common/common.module';
import { ApplicationService } from './application.service';
import { ApplicationLBK, ApplicationLBKSchema, ApplicationLBMO, ApplicationLBMOSchema } from './schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ApplicationLBK.name,
        schema: ApplicationLBKSchema,
      },
      {
        name: ApplicationLBMO.name,
        schema: ApplicationLBMOSchema,
      },
    ]),
    CommonModule,
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService],
})
export class ApplicationModule {
}
