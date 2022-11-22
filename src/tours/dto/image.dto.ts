import { IsAscii, IsString } from "class-validator";

export class ImageDto {
    @IsString()
    @IsAscii()
    title: string;

    @IsString()
    @IsAscii()
    filename: string;
}
