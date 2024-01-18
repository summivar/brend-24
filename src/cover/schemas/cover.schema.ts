import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CoverDocument = Cover & Document;

@Schema({
  timestamps: true,
})
export class Cover {
  @Prop({ required: true, unique: true })
  uniqueId: string;

  @Prop({ required: true, default: [] })
  photosPath: string[];
}

export const CoverSchema = SchemaFactory.createForClass(Cover);