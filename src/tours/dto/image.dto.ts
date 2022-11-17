import { IsAscii, IsString, ValidateIf } from "class-validator";

export class ImageDto {
    @IsString()
    @IsAscii()
    title: string;

    @ValidateIf((x) => x instanceof Buffer)
    data: Buffer;
}
