import { IsNumber, IsString, IsDateString, IsEnum } from "class-validator";
import { Meals } from "../constants/enums/meals";
import { IsInt32 } from "../int32.validator";

export class RegisteTourDto {
    @IsString()
    title: string;

    @IsString()
    countryName: string;

    @IsString()
    persianCountryName: string;

    @IsNumber()
    @IsInt32()
    price: number;

    @IsNumber()
    @IsInt32()
    priority: number;

    @IsNumber()
    seats: number;

    @IsString({ each: true })
    cities: string[];

    @IsEnum(Meals, { each: true })
    meals: string[];

    @IsDateString()
    startRegisterDate: string;

    @IsDateString()
    endRegisterDate: string;

    @IsDateString()
    arrivalDate: string;

    @IsDateString()
    departureDate: string;
}
