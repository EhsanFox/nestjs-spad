import { HttpException, HttpStatus } from "@nestjs/common";

export class InvalidPasswordException extends HttpException
{
    constructor(
        private readonly logData: Error | string,
        private readonly messaage: string = "Invalid password",
        private readonly stats: HttpStatus = HttpStatus.BAD_REQUEST
    )
    {
        super(messaage, stats)
        if(logData instanceof Error)
            console.error(logData);
        else
            console.log(logData);
    }
}