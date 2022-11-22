import { IsString, IsBoolean, IsOptional, IsAscii } from "class-validator";

export class CityDto {
    @IsString()
    country: string;

    @IsString()
    name: string;

    @IsString()
    persianName: string;

    @IsBoolean()
    isPopular: boolean;

    @IsString()
    @IsAscii()
    imageTitle: string;

    @IsOptional()
    image?: string;
}
