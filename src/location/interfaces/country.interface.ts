import { Document } from "mongoose";

export interface iCountry extends Document<string> {
    name: string;
    persianName: string;
    description: string;
    image: Buffer;
}
