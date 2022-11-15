import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { type Date, Types } from "mongoose";
import { Meals } from "../constants/enums/meals";
import { City } from "../../location/schemas/city.schema";
import { Location } from "../../location/schemas/location.schema";
import { Account } from "src/auth/schemas";

@Schema({ timestamps: true })
export class Tour {
    @Prop({ type: String, required: true, unique: true, lowercase: true })
    title: string;

    @Prop({ type: Types.ObjectId, required: true, ref: Location.name })
    location: Types.ObjectId;

    @Prop({ type: [Types.ObjectId], required: false, ref: City.name })
    cities: string[];

    @Prop({ type: [Types.ObjectId], required: false, ref: Account.name })
    customers: string[];

    @Prop({ type: Number, required: true })
    priority: number;

    @Prop({ type: Number, required: true })
    seats: number;

    @Prop({ type: Number, required: true })
    price: number;

    @Prop({ type: [String], enum: Meals, required: false, default: [] })
    includedMeals: Meals[];

    @Prop({ type: [String], required: false, default: [] })
    options: unknown[];

    @Prop({ type: Date, required: true })
    startRegisterDate: Date;

    @Prop({ type: Date, required: true })
    endRegisterDate: Date;

    @Prop({ type: Date, required: true })
    arrivalDate: Date;

    @Prop({ type: Date, required: true })
    departureDate: Date;

    @Prop({ type: Number, required: true })
    stayingDays: number;

    @Prop({ type: Number, required: true })
    stayingNights: number;
}

export const TourSchema = SchemaFactory.createForClass(Tour);
