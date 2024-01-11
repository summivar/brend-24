import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AboutDocument = About & Document;

@Schema({
  timestamps: true
})
export class About {
  @Prop({required: true, unique: true})
  uniqueId: string;

  @Prop({required: true})
  history: string;

  @Prop({required: true})
  forWhoThis: string;

  @Prop({required: true})
  nominations: string;

  @Prop({required: true})
  invitation: string;

  @Prop({required: true})
  howToAccept: string;

  @Prop({required: true})
  termsOfParticipation: string;
}

export const AboutSchema = SchemaFactory.createForClass(About);