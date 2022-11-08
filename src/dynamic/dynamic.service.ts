import { HttpService } from "@nestjs/axios";
import { catchError, firstValueFrom } from 'rxjs';
import type { AxiosError } from "axios"
import { InternalErrorException } from "src/excepetions";

export class DynamicService {
    constructor(
        private readonly url: string,
        private readonly axios: HttpService = new HttpService()
    ) {}

    public async requestAndLog(): Promise<void>
    {
        try {
            const { data } = await firstValueFrom(
                this.axios.get<unknown>(this.url).pipe(
                  catchError((error: AxiosError) => {
                    console.error(error.response.data);
                    throw 'An error happened!';
                  }),
                ),
              );
            console.log(data)
        } catch (error) {
            throw new InternalErrorException(error)
        }
    }
}
