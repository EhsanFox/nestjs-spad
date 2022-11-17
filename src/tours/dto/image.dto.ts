import { IsAscii, IsString, IsNotEmpty } from "class-validator";

export class ImageDto {
    @IsString()
    @IsAscii()
    title: string;

    @IsNotEmpty()
    data: Buffer;
}
