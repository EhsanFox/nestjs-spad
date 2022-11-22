import { Document } from "mongoose";
import { iCity } from "./city.interface";

export interface iCountry extends Document<string> {
    name: string;
    persianName: string;
    description: string;
    imageTitle: string;
    image: string;
    cityList: iCity[];
}
