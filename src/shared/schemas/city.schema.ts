import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true, _id: false })
export class City {
    @Prop({ type: String, required: true, lowercase: true })
    country: string;

    @Prop({ type: String, required: true, unique: true, lowercase: true })
    name: string;

    @Prop({ type: String, required: true })
    persianName: string;

    @Prop({ type: Boolean, required: false, default: false })
    isPopular: boolean;

    @Prop({ type: String, required: true })
    imageTitle: string;

    @Prop({ type: String, required: true })
    image: string;
}

export const CitySchema = SchemaFactory.createForClass(City);
