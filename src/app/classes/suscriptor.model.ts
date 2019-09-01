/*
Clase que se encarga de crear al suscriptor de mailchimp
*/
export class MailChimpSuscriptorClass {
    constructor (
        public email_address: string,
        public status: string,
        public tags: string[],
        public language: string,
        public merge_filds: any
    ) {}
}
