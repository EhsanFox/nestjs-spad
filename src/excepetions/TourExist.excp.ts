import { HttpException, HttpStatus } from "@nestjs/common";

export class TourExistException extends HttpException {
    constructor(
        private readonly logData?: Error | string,
        private readonly messaage: string = "Tour has been sold out or the registeration time has ran out or not yet arrived.",
        private readonly stats: HttpStatus = HttpStatus.GONE
    ) {
        super(messaage, stats);
        if (logData && logData instanceof Error) console.error(logData);
        else if (logData) console.log(logData);
    }
}
