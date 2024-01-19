import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ClauseDocument = Clause & Document;

@Schema({
  timestamps: true,
})
export class Clause {
  @Prop({ required: true, unique: true })
  uniqueId: string;

  @Prop({ required: true })
  filePath: string;
}

export const ClauseSchema = SchemaFactory.createForClass(Clause);