import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DisposalDocument = Disposal & Document;

@Schema({
  timestamps: true,
})
export class Disposal {
  @Prop({ required: true, unique: true })
  uniqueId: string;

  @Prop({ required: true })
  filePath: string;
}

export const DisposalSchema = SchemaFactory.createForClass(Disposal);