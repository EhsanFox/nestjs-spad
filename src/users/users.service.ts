import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AccountDocument } from "src/shared/account.interface";
import { Account } from "src/shared/account.schema";

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(Account.name)
        private readonly accountModel: Model<AccountDocument>
    ) {}
    async getUser(id: string) {
        return await this.accountModel.findOne({
            id,
        });
    }
}
