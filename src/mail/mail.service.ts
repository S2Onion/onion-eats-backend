import { Inject, Injectable } from '@nestjs/common';
import * as FormData from 'form-data';
import got from 'got';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { EmailVar, MailModuleOption } from './mail.interfaces';

@Injectable()
export class MailService {
    constructor(@Inject(CONFIG_OPTIONS) private readonly options: MailModuleOption) { }

    sendVerificationEmail(email: string, code: string) {
        const subject = 'Verify Your Email';
        const template = 'verify-email';
        const emailVars: EmailVar[] = [
            { key: 'v:code', value: code },
            { key: 'v:username', value: email }
        ];

        const toEmail = this.options.toEmail ? this.options.toEmail : email;

        this.sendEmail(subject, template, emailVars, toEmail);
    }

    private async sendEmail(subject: string, template: string, emailVars: EmailVar[], to: string) {
        const form = new FormData();
        form.append('from', `From Onion Eats <mailgun@${this.options.domain}>`);
        form.append('to', to);
        form.append('subject', subject);
        form.append('template', template);
        emailVars.forEach(eVar => { form.append(eVar.key, eVar.value) });

        try {
            await got(`https://api.mailgun.net/v3/${this.options.domain}/messages`, {
                headers: {
                    'Authorization': `Basic ${Buffer.from(`api:${this.options.apiKey}`).toString('base64')}`
                },
                method: 'POST',
                body: form
            });
        } catch (e) {
            console.log('Send email fail');
            console.log(e);
        }
    }
}