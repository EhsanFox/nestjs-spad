import { Module } from "@nestjs/common";
import { LocationService } from "./locations.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Location, LocationSchema } from "./schemas/location.schema";
import { City, CitySchema } from "./schemas/city.schema";
@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Location.name,
                schema: LocationSchema,
            },
            {
                name: City.name,
                schema: CitySchema,
            },
        ]),
    ],
    providers: [LocationService],
    exports: [LocationService],
})
export class LocationsModule {}
