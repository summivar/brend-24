import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ROLES_CONSTANTS } from '../../constants';

export type UsersDocument = User & Document;

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false })
  refreshToken: string;

  @Prop({ type: [String], enum: [ROLES_CONSTANTS.USER, ROLES_CONSTANTS.ADMIN], default: ROLES_CONSTANTS.USER })
  roles: string[];
}

export const UsersSchema = SchemaFactory.createForClass(User);