import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { iCity } from "src/shared/interfaces/city.interface";
import { CitySchema } from "src/shared/schemas/city.schema";
import { iTour } from "../interfaces/tours.interface";

@Schema({ timestamps: true })
export class Tour {
    @Prop({ type: String, required: true })
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

    @Prop({ type: CitySchema, required: true })
    city: iCity;

    @Prop({
        type: [
            {
                title: { type: String, required: true },
                url: { type: String, required: true },
            },
        ],
        required: true,
    })
    images: iTour["images"];
}

export const TourSchema = SchemaFactory.createForClass(Tour);
