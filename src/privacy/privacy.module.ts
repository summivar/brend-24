import { Module } from '@nestjs/common';
import { PrivacyService } from './privacy.service';
import { PrivacyController } from './privacy.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Privacy, PrivacySchema } from './schemas';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Privacy.name,
        schema: PrivacySchema,
      },
    ]),
    AuthModule,
  ],
  providers: [PrivacyService],
  controllers: [PrivacyController],
})
export class PrivacyModule {
}
