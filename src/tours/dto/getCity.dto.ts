import { ValidateIf } from "class-validator";

export class GetCityTourDto {
    @ValidateIf(
        (x: GetCityTourDto) =>
            x.persianName !== undefined || x.name !== undefined
    )
    name?: string;

    @ValidateIf(
        (x: GetCityTourDto) =>
            x.persianName !== undefined || x.name !== undefined
    )
    persianName?: string;
}
