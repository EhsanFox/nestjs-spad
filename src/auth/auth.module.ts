import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Account, AccountSchema } from "../shared/schemas/account.schema";

import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { AuthGuard } from "src/shared/auth.guard";
import { UsersModule } from "src/users/users.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Account.name, schema: AccountSchema },
        ]),
        UsersModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, AuthGuard],
})
export class AuthModule {}
