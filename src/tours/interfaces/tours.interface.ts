import { Document } from "mongoose";

export interface iTour extends Document {
    name: string;
    price: number;
    stayingDays: number;
    airline: string;
    hotelStars: number;
    description: string;
    isPopular: boolean;
    images: { url: string; title: string }[];
    city: string;
}
