import { HttpException, HttpStatus } from "@nestjs/common";

export class InternalErrorException extends HttpException
{
    constructor(
        private readonly logData: Error | string,
        private readonly messaage: string = "Internal Server Error",
        private readonly stats: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR
    )
    {
        super(messaage, stats)
        if(logData instanceof Error)
            console.error(logData);
        else
            console.log(logData);
    }
}