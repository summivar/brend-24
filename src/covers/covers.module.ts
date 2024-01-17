import { Module } from '@nestjs/common';
import { CoversController } from './covers.controller';
import { CoversService } from './covers.service';
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
  controllers: [CoversController],
  providers: [CoversService],
})
export class CoversModule {
}
