export interface MailModuleOption {
    apiKey: string;
    domain: string;
    fromEmail: string;
    toEmail?: string;
}

export interface EmailVar {
    key: string,
    value: string
}