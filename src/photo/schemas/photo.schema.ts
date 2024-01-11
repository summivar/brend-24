import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PhotoDocument = Photo & Document;

@Schema({
  timestamps: true,
})
export class Photo {
  @Prop({ required: true })
  photoPath: string;

  @Prop({ required: true })
  photoCaption: string;
}

export const PhotoSchema = SchemaFactory.createForClass(Photo);