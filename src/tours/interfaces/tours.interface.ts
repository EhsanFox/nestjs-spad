import { Document } from "mongoose";
import { iCity } from "src/shared/interfaces/city.interface";

export interface iTour extends Document {
    name: string;
    price: number;
    stayingDays: number;
    airline: string;
    hotelStars: number;
    description: string;
    isPopular: boolean;
    images: { url: string; title: string }[];
    city: iCity;
}
