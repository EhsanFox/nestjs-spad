import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";
export class CountryDto {
    @IsString()
    @Transform((x) => {
        const unParsedName: string = x.value;
        x.value = unParsedName.split(" ").join("_").split("-").join("_");
        return x;
    })
    name: string;

    @IsString()
    @Transform((x) => {
        const unParsedName: string = x.value;
        x.value = unParsedName.split(" ").join("_").split("-").join("_");
        return x;
    })
    persianName: string;

    @IsString()
    description: string;

    @IsNotEmpty()
    image: Buffer;
}
