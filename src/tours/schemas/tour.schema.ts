import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Country } from "src/location/schemas/country.schema";
import { City } from "../../location/schemas/city.schema";
import { iTour } from "../interfaces/tours.interface";

@Schema({ timestamps: true })
export class Tour {
    @Prop({ type: String, required: true, unique: true })
    name: string;

    @Prop({ type: Number, required: true })
    price: number;

    @Prop({ type: Number, required: true })
    stayingDays: number;

    @Prop({ type: String, required: true })
    airline: string;

    @Prop({ type: Number, required: true })
    hotelStars: number;

    @Prop({ type: String, required: true })
    description: string;

    @Prop({ type: Boolean, required: false, default: false })
    isPopular: boolean;

    @Prop({ type: String, required: true, ref: City.name })
    city: string;

    @Prop({ type: String, required: true, ref: Country.name })
    country: string;

    @Prop({
        type: [
            {
                title: { type: String, required: true },
                data: { type: Buffer, required: true },
            },
        ],
        required: true,
    })
    images: iTour["images"];
}

export const TourSchema = SchemaFactory.createForClass(Tour);
