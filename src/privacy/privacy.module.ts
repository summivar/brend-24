import { Module } from '@nestjs/common';
import { PrivacyService } from './privacy.service';
import { PrivacyController } from './privacy.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Privacy, PrivacySchema } from './schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Privacy.name,
        schema: PrivacySchema,
      },
    ]),
  ],
  providers: [PrivacyService],
  controllers: [PrivacyController],
})
export class PrivacyModule {
}
