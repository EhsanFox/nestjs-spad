import { Transform } from "class-transformer";
import { IsAscii, IsOptional, IsString } from "class-validator";
export class CountryDto {
    @IsString()
    @Transform(({ value }) => value.split(" ").join("_").split("-").join("_"))
    name: string;

    @IsString()
    @Transform(({ value }) => value.split(" ").join("_").split("-").join("_"))
    persianName: string;

    @IsString()
    description: string;

    @IsString()
    @IsAscii()
    imageTitle: string;

    @IsOptional()
    image?: string;
}
