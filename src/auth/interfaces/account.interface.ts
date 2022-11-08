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