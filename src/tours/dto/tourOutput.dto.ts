import { Exclude } from "class-transformer";

export class TourOutputDto {
    @Exclude()
    _id: unknown;
    @Exclude()
    __v: unknown;

    name: string;
    price: number;
    stayingDays: number;
    airline: string;
    hotelStars: number;
    description: string;
    isPopular: boolean;
    city: string;
    images: string[];

    constructor(partial: Partial<TourOutputDto>) {
        Object.assign(this, partial);
    }
}
