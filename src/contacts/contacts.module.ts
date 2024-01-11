import { Module } from '@nestjs/common';
import { ContactsController } from './contacts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Contacts, ContactsSchema } from './schemas';
import { ContactsService } from './contacts.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Contacts.name,
        schema: ContactsSchema,
      },
    ]),
    AuthModule,
  ],
  providers: [ContactsService],
  controllers: [ContactsController],
})
export class ContactsModule {
}
