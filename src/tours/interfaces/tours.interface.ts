import { Date, Document } from "mongoose";
import { Meals } from "../constants/enums/meals";
import { iLocation } from "../../location/interfaces/location.interface";

export interface iTour extends Document {
    title: string;
    location: iLocation;
    priority: number;
    customers: string[];
    seats: number;
    price: number;
    options: unknown[];
    includedMeals: Meals[];
    startRegisterDate: Date | string;
    endRegisterDate: Date | string;
    arrivalDate: Date | string;
    departureDate: Date | string;
    stayingNights: number;
    stayingDays: number;
}
