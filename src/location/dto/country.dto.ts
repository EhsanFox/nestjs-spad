import { Exclude, Transform } from "class-transformer";
export class CountryDto {
    @Exclude()
    _id: string;

    @Exclude()
    __v: unknown;

    @Transform((x) => {
        const unParsedName: string = x.value;
        return unParsedName.split(" ").join("_").split("-").join("_");
    })
    name: string;
    persianName: string;
    description: string;
    image: Buffer;

    constructor(partial: Partial<CountryDto>) {
        Object.assign(this, partial);
    }
}
