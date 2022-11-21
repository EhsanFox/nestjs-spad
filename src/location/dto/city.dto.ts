import { IsString, IsBoolean, IsOptional } from "class-validator";

export class CityDto {
    @IsString()
    country: string;

    @IsString()
    name: string;

    @IsString()
    persianName: string;

    @IsBoolean()
    isPopular: boolean;

    @IsOptional()
    image?: string;
}
