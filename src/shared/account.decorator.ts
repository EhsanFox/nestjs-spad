import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { AccountDocument } from "./account.interface";

export const AccountDecorator = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): AccountDocument => {
        const request = ctx.switchToHttp().getRequest<Request>();
        return request.account;
    }
);
