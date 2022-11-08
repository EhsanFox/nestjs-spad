import { IsEmail, IsString, IsNumber } from 'class-validator';

export class UpdateDto
{
    @IsString()
    @IsEmail()
    email?: string;

    @IsString()
    password?: string;

    @IsString()
    profile?: string;

    @IsNumber()
    credits?: number;
}
