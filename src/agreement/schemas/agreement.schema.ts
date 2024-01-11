import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AgreementDocument = Agreement & Document;

@Schema({
  timestamps: true
})
export class Agreement {
  @Prop({required: true, unique: true})
  uniqueId: string;

  @Prop({required: true})
  text: string;
}

export const AgreementSchema = SchemaFactory.createForClass(Agreement);