import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DistrictDocument = District & Document;

@Schema({
  timestamps: true,
})
export class District {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ default: [] })
  participants: Types.ObjectId[];
}

export const DistrictSchema = SchemaFactory.createForClass(District);