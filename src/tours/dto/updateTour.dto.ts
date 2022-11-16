import {
    IsNumber,
    IsString,
    IsOptional,
    IsDateString,
    IsEnum,
} from "class-validator";
import { Meals } from "../constants/enums/meals";
import { IsInt32 } from "../int32.validator";

export class UpdateTourDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    countryName?: string;

    @IsOptional()
    @IsString()
    persianCountryName?: string;

    @IsOptional()
    @IsNumber()
    @IsInt32()
    price?: number;

    @IsOptional()
    @IsNumber()
    @IsInt32()
    priority?: number;

    @IsOptional()
    @IsNumber()
    seats?: number;

    @IsOptional()
    @IsString({ each: true })
    cities?: string[];

    @IsOptional()
    @IsEnum(Meals, { each: true })
    meals?: string[];

    @IsOptional()
    @IsDateString()
    startRegisterDate?: string;

    @IsOptional()
    @IsDateString()
    endRegisterDate?: string;

    @IsOptional()
    @IsDateString()
    arrivalDate?: string;

    @IsOptional()
    @IsDateString()
    departureDate?: string;
}
