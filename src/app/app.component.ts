import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';
declare function track();
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {
  public eventConfirmation: any;
  constructor(private param: ActivatedRoute) {
    this.param.queryParams.subscribe(
      (data) => {
        this.eventConfirmation = data;
        console.log(data);
      }
    );
  }

  ngOnInit() {
    setTimeout(() => {
      if (this.eventConfirmation.invitee_uuid
        && (this.eventConfirmation.invitee_uuid !== '')
        && (this.eventConfirmation.invitee_uuid !== undefined)
        && (this.eventConfirmation.invitee_uuid !== null)) {
          console.log('Si hay data');
          $(document).ready(() => {
            track();
          });
        } else {
          // Lo redireccionamos
          location.href = 'https://www.syftedesigns.com/campaign/services';
        }
    }, 1000);
  }
}
