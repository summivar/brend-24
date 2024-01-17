import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PartnerDocument = Partner & Document;

@Schema({
  timestamps: true,
})
export class Partner {
  @Prop({ required: true })
  nameOfCompany: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  logoPath: string;
}

export const PartnerSchema = SchemaFactory.createForClass(Partner);