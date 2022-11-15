import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class City {
    @Prop({ type: String, required: true, unique: true, lowercase: true })
    name: string;
}

export const CitySchema = SchemaFactory.createForClass(City);
