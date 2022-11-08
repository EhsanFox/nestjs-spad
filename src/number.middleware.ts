
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class NumberMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if(req.body["credits"])
    {
        req.body["credits"] = Number(req.body["credits"].replace(/[۰-۹]/g, (s: string) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(s)));
        return next();
    }
    else return next();
  }
}
