import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type DistrictDocument = District & Document;

@Schema({
  timestamps: true,
})
export class District {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ default: [] })
  participants: ObjectId[];
}

export const DistrictSchema = SchemaFactory.createForClass(District);