import { Exclude } from "class-transformer";

export class CityDto {
    @Exclude()
    _id: string;

    @Exclude()
    __v: unknown;

    country: string;
    name: string;
    persianName: string;
    isPopular: boolean;
    image: Buffer;

    constructor(partial: Partial<CityDto>) {
        Object.assign(this, partial);
    }
}
