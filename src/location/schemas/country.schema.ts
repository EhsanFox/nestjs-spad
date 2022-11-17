import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Country {
    @Prop({ type: String, required: true, unique: true, lowercase: true })
    name: string;

    @Prop({ type: String, required: true })
    persianName: string;

    @Prop({ type: String, required: true })
    description: string;

    @Prop({ type: Buffer, required: true })
    image: Buffer;
}

export const CountrySchema = SchemaFactory.createForClass(Country);
