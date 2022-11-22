import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { AuthModule } from "./auth/auth.module";
import { ToursModule } from "./tours/tours.module";
import { LocationsModule } from "./location/locations.module";
import { UsersModule } from "./users/users.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";

@Module({
    imports: [
        ConfigModule.forRoot(),
        ThrottlerModule.forRoot({ ttl: 60, limit: 10 }),
        MongooseModule.forRoot(process.env.MONGODB_URL),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, "..", "uploads"),
        }),
        AuthModule,
        ToursModule,
        UsersModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
