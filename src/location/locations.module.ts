import { Module } from "@nestjs/common";
import { LocationService } from "./locations.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Country, CountrySchema } from "../shared/schemas/country.schema";
import { City } from "../shared/schemas/city.schema";
import { LocationController } from "./location.controller";
import { UsersModule } from "src/users/users.module";
import { AuthGuard } from "src/shared/auth.guard";
@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Country.name,
                schema: CountrySchema,
            },
        ]),
        UsersModule,
    ],
    providers: [LocationService, AuthGuard],
    controllers: [LocationController],
    exports: [LocationService],
})
export class LocationsModule {}
