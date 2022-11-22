import { Module } from "@nestjs/common";
import { LocationService } from "./locations.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Country, CountrySchema } from "../shared/schemas/country.schema";
import { City, CitySchema } from "../shared/schemas/city.schema";
@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Country.name,
                schema: CountrySchema,
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
