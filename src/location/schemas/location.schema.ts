import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { City } from "./city.schema";

@Schema({ timestamps: true })
export class Location {
    @Prop({ type: String, required: true, unique: true, lowercase: true })
    countryName: string;

    @Prop({ type: String, required: true })
    persianName: string;

    @Prop({
        type: [Types.ObjectId],
        required: false,
        default: [],
        ref: City.name,
    })
    cities: string[];
}

export const LocationSchema = SchemaFactory.createForClass(Location);
