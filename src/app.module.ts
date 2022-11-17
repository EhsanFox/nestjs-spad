import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { NumberMiddleware } from "./number.middleware";
import { AuthModule } from "./auth/auth.module";
import { ToursModule } from "./tours/tours.module";
import { LocationsModule } from "./location/locations.module";
import { UsersModule } from "./users/users.module";

@Module({
    imports: [
        ConfigModule.forRoot(),
        ThrottlerModule.forRoot({ ttl: 60, limit: 10 }),
        MongooseModule.forRoot(process.env.MONGODB_URL),
        AuthModule,
        LocationsModule,
        ToursModule,
        UsersModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(NumberMiddleware)
            .forRoutes({ path: "auth", method: RequestMethod.PATCH });
    }
}
