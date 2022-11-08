import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface AccountTypeDoc {
    email: string;
    password: string;
    profile: string;
    credits: number;
    refreshToken: string;
}

export interface AccountDocument extends Document<string, any, AccountTypeDoc>
{
    email: string;
    password: string;
    profile: string;
    credits: number;
    refreshToken: string;
}

@Schema({ timestamps: true })
export class Account
{
    @Prop({ type: String, unique: true, required: true })
    email: string;

    @Prop({ type: String, required: true })
    password: string;

    @Prop({ type: String, required: false, default: "" /* Change to a default profile pic url */ })
    profile: string;

    @Prop({ type: Number, required: false, default: 0 })
    credits: number

    @Prop({ type: String })
    refreshToken: string
}

export const AccountSchema = SchemaFactory.createForClass(Account);
