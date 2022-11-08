import { HttpException, HttpStatus } from "@nestjs/common";

export class UserNotFound extends HttpException
{
    constructor(
        private readonly logData: Error | string,
        private readonly messaage: string = "User not found",
        private readonly stats: HttpStatus = HttpStatus.NOT_FOUND
    )
    {
        super(messaage, stats)
        if(logData instanceof Error)
            console.error(logData);
        else
            console.log(logData);
    }
}