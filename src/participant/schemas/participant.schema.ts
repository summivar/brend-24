import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ParticipantDocument = Participant & Document;

@Schema({
  timestamps: true,
})
export class Participant {
  @Prop({ required: true })
  nameOfBrand: string;

  @Prop({ required: true })
  nameOfCompany: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  district: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  logoPath: string;
}

export const ParticipantSchema = SchemaFactory.createForClass(Participant);