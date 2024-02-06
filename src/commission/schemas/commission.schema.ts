import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CommissionDocument = Commission & Document;

@Schema({
  timestamps: true,
})
export class Commission {
  @Prop({ required: true, unique: true })
  uniqueId: string;

  @Prop({ required: true })
  filePath: string;
}

export const CommissionSchema = SchemaFactory.createForClass(Commission);