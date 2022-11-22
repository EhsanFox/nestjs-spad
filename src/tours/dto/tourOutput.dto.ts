import { Types } from "mongoose";
import { iCity } from "src/shared/interfaces/city.interface";
import { iTour } from "../interfaces/tours.interface";

export class TourOutputDto {
    _id: Types.ObjectId;
    __v: unknown;

    name: string;
    price: number;
    stayingDays: number;
    airline: string;
    hotelStars: number;
    description: string;
    isPopular: boolean;
    city: iCity;
    images: iTour["images"];

    constructor(partial: Partial<TourOutputDto>) {
        this.name = partial.name;
        this.price = partial.price;
        this.stayingDays = partial.stayingDays;
        this.airline = partial.airline;
        this.hotelStars = partial.hotelStars;
        this.description = partial.description;
        this.isPopular = partial.isPopular;
        this.city = partial.city;
        this.images = partial.images;
    }
}
