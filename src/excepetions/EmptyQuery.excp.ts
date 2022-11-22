import { HttpException, HttpStatus } from "@nestjs/common";

export class EmptyQueryException extends HttpException {
    constructor(
        private readonly logData?: Error | string,
        private readonly messaage: string = "Atleast one query most be sent.",
        private readonly stats: HttpStatus = HttpStatus.NO_CONTENT
    ) {
        super(messaage, stats);
        if (logData && logData instanceof Error) console.error(logData);
        else if (logData) console.log(logData);
    }
}
