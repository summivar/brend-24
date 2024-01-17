import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VideoDocument = Video & Document;

@Schema({
  timestamps: true,
})
export class Video {
  @Prop({ required: true })
  videoTime: Date;

  @Prop({ required: true })
  videoLink: string;

  @Prop({ required: true })
  videoCaption: string;
}

export const VideoSchema = SchemaFactory.createForClass(Video);