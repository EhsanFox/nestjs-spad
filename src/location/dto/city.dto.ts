import { IsString, IsBoolean, IsNotEmpty } from "class-validator";

export class CityDto {
    @IsString()
    country: string;

    @IsString()
    name: string;

    @IsString()
    persianName: string;

    @IsBoolean()
    isPopular: boolean;

    @IsNotEmpty()
    image: Buffer;
}
