import { DynamicModule, Module } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { MailModuleOption } from './mail.interfaces';
import { MailService } from './mail.service';

@Module({})
export class MailModule {
    static forRoot(options: MailModuleOption): DynamicModule {
        return {
            module: MailModule,
            providers: [
                {
                    provide: CONFIG_OPTIONS,
                    useValue: options,
                },
                MailService
            ],
            exports: [MailService],
        }
    }
}
