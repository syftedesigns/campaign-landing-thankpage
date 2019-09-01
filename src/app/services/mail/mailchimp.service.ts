import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { MatSnackBar } from '@angular/material';
import { MailChimpSuscriptorClass } from 'src/app/classes/suscriptor.model';

@Injectable({
  providedIn: 'root'
})
export class MailchimpService {

  constructor(private _http: HttpClient, private snackBar: MatSnackBar) { }

  // Genera un key unico para las peticiones de subscripción
  private randomString(): string {
      return new Date().valueOf().toString();
  }
  // Envia una petición para suscribir a usuarios en mailchimp
  SubscribeToMailChimp(suscription: MailChimpSuscriptorClass) {
    const url = 'https://us4.api.mailchimp.com/3.0/lists/e520e1576b/members/'; // Donde se alojan los miembros de syfte
    return this._http.post(url, JSON.stringify(suscription), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(`${this.randomString()}:2a4ce36da72f906613c6bb64be098e63-us4`),
        'X-HTTP-Method-Override': 'POST'
      }
    }).pipe(
      map((resp: any) => {
        return resp;
      }),
      catchError( (err: any)  => {
        console.error(err);
        this.snackBar.open('Ops! Tenemos problemas para procesar su información. Por favor inténtelo de nuevo', null, {
          duration: 5000,
          panelClass: ['red-snackbar']
        });
        return new Observable<string | boolean>();
      })
    );
  }

  // Mailchimp JSONP
  SubscribeToMailChimpJSONP(suscription: MailChimpSuscriptorClass) {
    const params = new HttpParams()
    .set('EMAIL', suscription.email_address)
    .set('FNAME', suscription.merge_filds.FNAME)
    .set('LNAME', suscription.merge_filds.LNAME)
    .set('b_9b1f8ee1168f03c1c6cd9c867_e520e1576b', '')
    .set('TAG', 'Customer Scheduled');
    // Lo que hacemos es el formulario generado de forma automatica en mailchimp lo aplicamos aca pero con JSONP
    let url = 'https://syftedesigns.us4.list-manage.com/subscribe/post-json?u=9b1f8ee1168f03c1c6cd9c867&amp;id=e520e1576b&';
    url += params.toString();
    return this._http.jsonp(url, 'c').pipe(
      map((resp: any) => {
        return resp;
      }),
      catchError( (err: any)  => {
        console.error(err);
        this.snackBar.open('Ops! Tenemos problemas para procesar su información. Por favor inténtelo de nuevo', null, {
          duration: 5000,
          panelClass: ['red-snackbar']
        });
        return new Observable<string | boolean>();
      })
    );
  }
}
