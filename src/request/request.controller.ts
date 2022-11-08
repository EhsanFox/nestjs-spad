import { Controller, Inject, Get } from '@nestjs/common';
import { DYNAMIC_MODULE } from 'src/constants';
import { DynamicService } from 'src/dynamic/dynamic.service';

@Controller('request')
export class RequestController {
    constructor(
        @Inject(DYNAMIC_MODULE) private readonly dynamicService: DynamicService,  
    ) {}

    @Get('trigger')
    async triggerMethod()
    {
        await this.dynamicService.requestAndLog()
        return 'some text to answer the call.'
    }

    @Get('log')
    someResponse()
    {
        return 'Hello world!';
    }
}
