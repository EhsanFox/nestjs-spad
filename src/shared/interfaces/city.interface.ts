import { Document } from "mongoose";

export interface iCity extends Document<string> {
    country: string;
    name: string;
    persianName: string;
    image: string;
    isPopular: boolean;
}
