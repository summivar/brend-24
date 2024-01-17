import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DistrictDocument = District & Document;

@Schema({
  timestamps: true,
  _id: false,
})
export class District {
  @Prop({ type: Types.ObjectId })
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ default: [] })
  participants: Types.ObjectId[];
}

export const DistrictSchema = SchemaFactory.createForClass(District);