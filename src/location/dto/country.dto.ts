import { Exclude, Transform } from "class-transformer";
export class CountryDto {
    @Exclude()
    _id: string;

    @Exclude()
    __v: unknown;

    @Transform((x) => {
        const unParsedName: string = x.value;
        x.value = unParsedName.split(" ").join("_").split("-").join("_");
        return x;
    })
    name: string;
    persianName: string;
    description: string;
    image: Buffer;

    constructor(partial: Partial<CountryDto>) {
        Object.assign(this, partial);
    }
}
