import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { iCity } from "../interfaces/city.interface";
import { CitySchema } from "./city.schema";

@Schema({ timestamps: true })
export class Country {
    @Prop({ type: String, required: true, unique: true, lowercase: true })
    name: string;

    @Prop({ type: String, required: true })
    persianName: string;

    @Prop({ type: String, required: true })
    description: string;

    @Prop({ type: String, required: true })
    imageTitle: string;

    @Prop({ type: String, required: true })
    image: string;

    @Prop({ type: [CitySchema], required: true })
    cityList: iCity[];
}

export const CountrySchema = SchemaFactory.createForClass(Country);
