import { IsNumber, IsString, IsEnum } from "class-validator";
import { Meals } from "../constants/enums/meals";

export class BuyTourDto {
    @IsString()
    title: string;

    @IsNumber()
    passengerCount: number;

    @IsEnum(Meals, { each: true })
    meals: Meals[];
}
