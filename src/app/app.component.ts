import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';
import { DbService } from './services/mail/db.service';
import { MailchimpService } from './services/mail/mailchimp.service';
import { CampaignObject } from './classes/campaign.model';
import { MailChimpSuscriptorClass } from './classes/suscriptor.model';
declare function track();
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {
  public eventConfirmation: any;
  constructor(private param: ActivatedRoute, private db: DbService,
              private mailchimp: MailchimpService) {
    this.param.queryParams.subscribe(
      (data) => {
        this.eventConfirmation = data;
        console.log(data);
      }
    );
  }

  ngOnInit() {
    setTimeout(async () => {
      if (this.eventConfirmation.invitee_uuid
        && (this.eventConfirmation.invitee_uuid !== '')
        && (this.eventConfirmation.invitee_uuid !== undefined)
        && (this.eventConfirmation.invitee_uuid !== null)) {
          console.log('Si hay data');
          if (await this.SignCustomerSheduled() && (await this.SignCustomerSheduledToMailchimp())) {
            // Lo registro en Syfte
            console.log('Registrado con éxito');
          } else {
            console.log('No pudo hacer el registro');
          }
          $(document).ready(() => {
            track();
          });
        } else {
          // Lo redireccionamos
          location.href = 'https://www.syftedesigns.com/campaign/services';
        }
    }, 1000);
  }

  /*
  Esta es la pagina de confirmación de que un usuario ha programado un evento con Syfte
  por lo que se convierte en un cliente potencial que nos ha proporcionado sus datos
  asi que esta función se encarga de registrarlo a nivel de sistema como cliente y en el sistema de correos
  */
 SignCustomerSheduled(): Promise<boolean> {
   return new Promise((resolve, reject) => {
      const name: string = `${this.eventConfirmation.invitee_first_name} ${this.eventConfirmation.invitee_last_name}`;
      const CampaignScheduled = new CampaignObject(name, this.eventConfirmation.invitee_email,
      this.eventConfirmation.answer_3, this.eventConfirmation.event_type_name);
      this.db.RegisterNewAffiliation(CampaignScheduled, 'affiliation_track')
        .subscribe((data) => {
          if (data.status) {
            resolve(true);
          } else {
            resolve(null);
          }
        });
   });
 }
 SignCustomerSheduledToMailchimp(): Promise<boolean> {
   return new Promise((resolve, reject) => {
    const ObjectSuscription = new MailChimpSuscriptorClass(this.eventConfirmation.invitee_email, 'subscribed', ['Suscriptores'], 'es_ES',
      {
        FNAME: this.eventConfirmation.invitee_first_name,
        LNAME: this.eventConfirmation.invitee_last_name
      });
      this.mailchimp.SubscribeToMailChimpJSONP(ObjectSuscription)
        .subscribe((data) => {
          if (data.result === 'success') {
            resolve(true);
          } else {
            console.error(data);
            resolve(null);
          }
        });
   });
 }
}
