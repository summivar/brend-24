import { Module } from '@nestjs/common';
import { CoverService } from './cover.service';
import { CoverController } from './cover.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cover, CoverSchema } from './schemas';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Cover.name,
        schema: CoverSchema,
      },
    ]),
    CommonModule,
  ],
  providers: [CoverService],
  controllers: [CoverController],
})
export class CoverModule {
}
