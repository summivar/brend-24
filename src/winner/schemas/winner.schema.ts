import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WinnerDocument = Winner & Document;

@Schema({
  timestamps: true,
})
export class Winner {
  @Prop({ required: true, unique: true })
  nameFile: string;

  @Prop({ required: true })
  filePath: string;
}

export const WinnerSchema = SchemaFactory.createForClass(Winner);