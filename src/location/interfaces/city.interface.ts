import { Document } from "mongoose";

export interface iCity extends Document<string> {
    name: string;
}
