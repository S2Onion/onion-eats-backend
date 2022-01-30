import { DynamicModule, Module } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { MailModuleInterface } from './mail.interfaces';

@Module({})
export class MailModule {
    static forRoot(options: MailModuleInterface): DynamicModule {
        return {
            module: MailModule,
            providers: [
                {
                    provide: CONFIG_OPTIONS,
                    useValue: options,
                },
            ],
            exports: [],
        }
    }
}
