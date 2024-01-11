import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventDocument = Event & Document;

@Schema({
  timestamps: true,
})
export class Event {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  @Prop({ required: true })
  description: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);