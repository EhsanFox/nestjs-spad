import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from '@nestjs/throttler';
import { NumberMiddleware } from './number.middleware';
import { DynamicModule } from './dynamic/dynamic.module';
import { RequestModule } from './request/request.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot({ ttl: 60, limit: 10 }),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    DynamicModule.forRoot("http://localhost:3000/request/log"),
    RequestModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer
          .apply(NumberMiddleware)
          .forRoutes({ path: "auth", method: RequestMethod.PATCH })
  }
}
