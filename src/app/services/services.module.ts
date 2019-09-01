import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { AngularMaterialModule } from '../angular-material.module';
import { MailchimpService } from './mail/mailchimp.service';
import { DbService } from './mail/db.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    HttpClientJsonpModule,
    AngularMaterialModule
  ],
  providers: [
    MailchimpService,
    DbService
  ],
  declarations: []
})
export class ServicesModule { }
