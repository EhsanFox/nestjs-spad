import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AccountDocument } from './interfaces';

export const AccountDecorator = createParamDecorator((data: unknown, ctx: ExecutionContext): AccountDocument =>
{
    const request = ctx.switchToHttp().getRequest();
    return request.account;
});
