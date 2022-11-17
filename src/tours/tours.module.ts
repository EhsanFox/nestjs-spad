import { Module } from "@nestjs/common";
import { ToursService } from "./tours.service";
import { ToursController } from "./tours.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Tour, TourSchema } from "./schemas/tour.schema";
import { LocationsModule } from "src/location/locations.module";
import { AuthGuard } from "src/shared/auth.guard";
import { UsersModule } from "src/users/users.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Tour.name,
                schema: TourSchema,
            },
        ]),
        LocationsModule,
        UsersModule,
    ],
    providers: [ToursService, AuthGuard],
    controllers: [ToursController],
})
export class ToursModule {}
