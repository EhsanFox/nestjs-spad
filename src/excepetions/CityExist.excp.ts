import { HttpException, HttpStatus } from "@nestjs/common";

export class CityExistException extends HttpException {
    constructor(
        private readonly logData?: Error | string,
        private readonly messaage: string = "City already exist",
        private readonly stats: HttpStatus = HttpStatus.CONFLICT
    ) {
        super(messaage, stats);
        if (logData && logData instanceof Error) console.error(logData);
        else if (logData) console.log(logData);
    }
}
