import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { SYFTE_API } from 'src/app/enviroments/API.config';
import { CampaignObject } from 'src/app/classes/campaign.model';
import { map, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(private _http: HttpClient, private snackBar: MatSnackBar) { }

  RegisterNewAffiliation(objectCampaign: CampaignObject, operationType: string) {
    const url = `${SYFTE_API}/affiliation.php?operationType=${operationType}`;
    const form = new FormData();
    form.append('NAME', objectCampaign.name);
    form.append('EMAIL', objectCampaign.email);
    form.append('CAMPAIGN', objectCampaign.campaign);
    form.append('SERVICE', objectCampaign.helper);
    return this._http.post(url, form).pipe(
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
