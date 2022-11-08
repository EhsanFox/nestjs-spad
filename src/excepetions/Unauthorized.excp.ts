import { HttpException, HttpStatus } from "@nestjs/common";

export class UnauthorizedException extends HttpException
{
    constructor(
        private readonly logData: Error | string,
        private readonly messaage: string = "Invalid credentials",
        private readonly stats: HttpStatus = HttpStatus.UNAUTHORIZED
    )
    {
        super(messaage, stats)
        if(logData instanceof Error)
            console.error(logData);
        else
            console.log(logData);
    }
}