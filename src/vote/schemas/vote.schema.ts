import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VoteDocument = Vote & Document;

@Schema({
  timestamps: true,
})
export class Vote {
  @Prop({ required: true, unique: true })
  uniqueId: string;

  @Prop({ required: true })
  link: string;

  @Prop({ required: true })
  votingId: number;

  @Prop({ required: true, default: false })
  isEnabled: boolean;
}

export const VoteSchema = SchemaFactory.createForClass(Vote);