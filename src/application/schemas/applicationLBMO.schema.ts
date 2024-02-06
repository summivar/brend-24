import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ApplicationLBMODocument = ApplicationLBMO & Document;

@Schema({
  timestamps: true,
})
export class ApplicationLBMO {
  @Prop({ required: true, unique: true })
  uniqueId: string;

  @Prop({ required: true })
  filePath: string;
}

export const ApplicationLBMOSchema = SchemaFactory.createForClass(ApplicationLBMO);