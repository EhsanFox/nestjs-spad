import { Module, DynamicModule as NestDynamicModule, Provider } from '@nestjs/common';
import { DYNAMIC_MODULE } from 'src/constants';
import { DynamicService } from './dynamic.service';

@Module({})
export class DynamicModule {

    static forRoot(url: string): NestDynamicModule
    {
        const dynamicProvider: Provider = {
            provide: DYNAMIC_MODULE,
            useValue: new DynamicService(url)
        }
        return {
            module: DynamicModule,
            providers: [dynamicProvider],
            exports: [dynamicProvider],
            global: true
        }
    }
}
