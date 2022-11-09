import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AccountDocument } from './interfaces';

export const AccountDecorator = createParamDecorator((data: unknown, ctx: ExecutionContext): AccountDocument =>
{
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.account;
});
