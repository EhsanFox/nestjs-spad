import { HttpException, HttpStatus } from "@nestjs/common";

export class CountryNotFoundException extends HttpException {
    constructor(
        private readonly logData?: Error | string,
        private readonly messaage: string = "Country not found",
        private readonly stats: HttpStatus = HttpStatus.NOT_FOUND
    ) {
        super(messaage, stats);
        if (logData && logData instanceof Error) console.error(logData);
        else if (logData) console.log(logData);
    }
}
