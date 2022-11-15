import { Document } from "mongoose";

export interface iLocation extends Document {
    countryName: string;
    persianName: string;
    cities: string[];
}
