import { Module } from '@nestjs/common';
import { ClauseController } from './clause.controller';
import { ClauseService } from './clause.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Clause, ClauseSchema } from './schemas';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Clause.name,
        schema: ClauseSchema,
      },
    ]),
    CommonModule,
  ],
  controllers: [ClauseController],
  providers: [ClauseService],
})
export class ClauseModule {
}
