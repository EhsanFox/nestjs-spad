import { Types } from "mongoose";

export class CityOutputDto {
    _id: Types.ObjectId;
    __v: unknown;

    country: string;
    name: string;
    persianName: string;
    isPopular: boolean;
    imageTitle: string;
    image: string;

    constructor(partial: Partial<CityOutputDto>) {
        this.country = partial.country;
        this.name = partial.name;
        this.persianName = partial.persianName;
        this.isPopular = partial.isPopular;
        this.image = partial.image;
        this.imageTitle = partial.imageTitle;
    }
}
