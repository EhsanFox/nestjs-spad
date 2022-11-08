import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Account, AccountSchema } from './schemas';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module(
{
    imports:
    [
        MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }])
    ],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {}
