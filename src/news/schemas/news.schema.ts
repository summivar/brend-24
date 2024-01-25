import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NewsDocument = News & Document;

@Schema({
  timestamps: true,
})
export class News {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  photoPath: string;

  @Prop({ required: true })
  photoCaption: string;

  @Prop({ required: true })
  newsText: string;

  @Prop({ required: true })
  newsDate: Date;
}

export const NewsSchema = SchemaFactory.createForClass(News);