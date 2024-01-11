import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PrivacyDocument = Privacy & Document;

@Schema({
  timestamps: true
})
export class Privacy {
  @Prop({required: true, unique: true})
  uniqueId: string;

  @Prop({required: true})
  text: string;
}

export const PrivacySchema = SchemaFactory.createForClass(Privacy);