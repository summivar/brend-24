import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VideoDocument = Video & Document;

@Schema({
  timestamps: true,
})
export class Video {
  @Prop({ required: true })
  videoPath: string;

  @Prop({ required: true })
  videoCaption: string;
}

export const VideoSchema = SchemaFactory.createForClass(Video);