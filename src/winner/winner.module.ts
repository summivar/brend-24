import { Module } from '@nestjs/common';
import { WinnerController } from './winner.controller';
import { WinnerService } from './winner.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Winner, WinnerSchema } from './schemas';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Winner.name,
        schema: WinnerSchema,
      },
    ]),
    CommonModule,
  ],
  controllers: [WinnerController],
  providers: [WinnerService],
})
export class WinnerModule {
}
