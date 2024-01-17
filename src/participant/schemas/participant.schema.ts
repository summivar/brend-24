import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ParticipantDocument = Participant & Document;

@Schema({
  timestamps: true,
  _id: false,
})
export class Participant {
  @Prop({type: Types.ObjectId})
  _id: Types.ObjectId;

  @Prop({ required: true })
  nameOfBrand: string;

  @Prop({ required: true })
  nameOfCompany: string;

  @Prop({ required: true })
  address: string;

  @Prop({ type: Types.ObjectId, required: true })
  district: Types.ObjectId;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  logoPath: string;
}

export const ParticipantSchema = SchemaFactory.createForClass(Participant);