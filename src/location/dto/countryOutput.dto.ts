import { Exclude } from "class-transformer";
export class CountryOutputDto {
    @Exclude()
    _id: string;

    @Exclude()
    __v: unknown;

    name: string;
    persianName: string;
    description: string;
    image: string;

    constructor(partial: Partial<CountryOutputDto>) {
        Object.assign(this, partial);
    }
}
