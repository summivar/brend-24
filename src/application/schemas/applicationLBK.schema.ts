import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ApplicationLBKDocument = ApplicationLBK & Document;

@Schema({
  timestamps: true,
})
export class ApplicationLBK {
  @Prop({ required: true, unique: true })
  uniqueId: string;

  @Prop({ required: true })
  filePath: string;
}

export const ApplicationLBKSchema = SchemaFactory.createForClass(ApplicationLBK);