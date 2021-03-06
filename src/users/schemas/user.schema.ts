import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ require: true, unique: true })
  username: string;

  @Prop({ require: true, unique: true })
  email: string;

  @Prop({ require: true })
  password: string;

  @Prop({ require: true })
  salt: string;

  @Prop({ ref: 'User' })
  friends: string[];

  @Prop({ default: true })
  online: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
