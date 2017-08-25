import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { CoreModule } from '../core/core.module';
import { AffiliateRoutingModule } from './affiliate-routing.module';
import { AffiliateComponent } from './affiliate.component';
import { DateTimePickerModule } from 'ng-pick-datetime';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import {Web3Service} from "../web3.service";
import {BrowserModule} from "@angular/platform-browser";
import {HttpClientModule} from "@angular/common/http";
import {TransactionModule} from "../transaction/transaction.module";

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    CoreModule,
    AffiliateRoutingModule,
    DateTimePickerModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    TransactionModule
  ],
  declarations: [
    AffiliateComponent
  ],
  providers: [
    Web3Service
  ]
})
export class AffiliateModule { }
