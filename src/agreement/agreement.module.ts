import { Module } from '@nestjs/common';
import { AgreementService } from './agreement.service';
import { AgreementController } from './agreement.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Agreement, AgreementSchema } from './schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Agreement.name,
        schema: AgreementSchema,
      },
    ]),
  ],
  providers: [AgreementService],
  controllers: [AgreementController],
})
export class AgreementModule {
}
