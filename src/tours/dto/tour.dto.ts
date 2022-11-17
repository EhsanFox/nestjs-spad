import {
    IsNumber,
    IsString,
    IsAscii,
    IsBoolean,
    IsArray,
    ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { IsHotelStar } from "../hotelstar.validator";
import { IsInt32 } from "../int32.validator";
import { iTour } from "../interfaces/tours.interface";
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
    images: iTour["images"];
}
