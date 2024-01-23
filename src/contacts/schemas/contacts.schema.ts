import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ContactsDocument = Contacts & Document;

@Schema({
  timestamps: true,
})
export class Contacts {
  @Prop({ required: true, unique: true })
  uniqueId: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  number: string[];

  @Prop({ required: true })
  email: string[];

  @Prop({ required: true })
  whatsappLink: string;
}

export const ContactsSchema = SchemaFactory.createForClass(Contacts);