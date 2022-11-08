import { HttpException, HttpStatus } from "@nestjs/common";

export class UserExistException extends HttpException
{
    constructor(
        private readonly logData: Error | string,
        private readonly messaage: string = "User already exist",
        private readonly stats: HttpStatus = HttpStatus.CONFLICT
    )
    {
        super(messaage, stats)
        if(logData instanceof Error)
            console.error(logData);
        else
            console.log(logData);
    }
}