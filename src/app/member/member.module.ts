import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { CoreModule } from '../core/core.module';
import { DateTimePickerModule } from 'ng-pick-datetime';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import {Web3Service} from "../web3.service";
import {BrowserModule} from "@angular/platform-browser";
import {HttpClientModule} from "@angular/common/http";
import {MemberComponent} from "./member.component";
import {MemberRoutingModule} from "./member-routing.module";
import {TransactionModule} from "../transaction/transaction.module";

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    CoreModule,
    MemberRoutingModule,
    DateTimePickerModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    TransactionModule
  ],
  declarations: [
    MemberComponent
  ],
  providers: [
    Web3Service
  ]
})
export class MemberModule { }
