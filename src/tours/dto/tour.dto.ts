import { Type } from "class-transformer";
import {
    IsNumber,
    IsString,
    IsAscii,
    IsBoolean,
    IsOptional,
    IsArray,
    ValidateNested,
} from "class-validator";
import { IsHotelStar } from "../hotelstar.validator";
import { IsInt32 } from "../int32.validator";
import { ImageDto } from "./image.dto";

export class TourDto {
    @IsString()
    @IsAscii()
    name: string;

    @IsNumber()
    @IsInt32()
    price: number;

    @IsNumber()
    stayingDays: number;

    @IsString()
    @IsAscii()
    airline: string;

    @IsNumber()
    @IsHotelStar()
    hotelStars: number;

    @IsString()
    description: string;

    @IsBoolean()
    isPopular: boolean;

    @IsString()
    city: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ImageDto)
    imageTitles: { filename: string; title: string }[];

    @IsOptional()
    images?: string[];
}
