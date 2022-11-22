import { Types } from "mongoose";

export class CountryOutputDto {
    _id: Types.ObjectId;
    __v: unknown;

    name: string;
    countryId: string | number;
    persianName: string;
    description: string;
    imageTitle: string;
    image: string;

    constructor(partial: Partial<CountryOutputDto>) {
        this.name = partial.name;
        this.countryId = partial._id.toString();
        this.persianName = partial.persianName;
        this.description = partial.description;
        this.imageTitle = partial.imageTitle;
        this.image = partial.image;
    }
}
