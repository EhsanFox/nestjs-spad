import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Account, AccountSchema } from "src/shared/schemas/account.schema";
import { AuthGuard } from "src/shared/auth.guard";
import { UsersService } from "./users.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Account.name, schema: AccountSchema },
        ]),
    ],
    providers: [UsersService, AuthGuard],
    exports: [UsersService],
})
export class UsersModule {}
