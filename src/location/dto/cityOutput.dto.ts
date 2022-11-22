import { Exclude } from "class-transformer";

export class CityOutputDto {
    @Exclude()
    _id: string;

    @Exclude()
    __v: unknown;

    country: string;
    name: string;
    persianName: string;
    isPopular: boolean;
    imageTitle: string;
    image: string;

    constructor(partial: Partial<CityOutputDto>) {
        Object.assign(this, partial);
    }
}
