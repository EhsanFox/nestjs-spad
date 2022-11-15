import { Module } from "@nestjs/common";
import { ToursService } from "./tours.service";
import { ToursController } from "./tours.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Location, LocationSchema } from "src/location/schemas/location.schema";
import { Tour, TourSchema } from "./schemas/tour.schema";
import { LocationsModule } from "src/location/locations.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Location.name,
                schema: LocationSchema,
            },
            {
                name: Tour.name,
                schema: TourSchema,
            },
        ]),
        LocationsModule,
    ],
    providers: [ToursService],
    controllers: [ToursController],
})
export class ToursModule {}
