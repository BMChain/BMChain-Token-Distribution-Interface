import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { CoreModule } from '../core/core.module';
import { DateTimePickerModule } from 'ng-pick-datetime';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import {Web3Service} from "../web3.service";
import {BrowserModule} from "@angular/platform-browser";
import {HttpClientModule} from "@angular/common/http";
import {CheckRoutingModule} from "./check-routing.module";
import {CheckComponent} from "./check.component";

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    CoreModule,
    CheckRoutingModule,
    DateTimePickerModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule
  ],
  declarations: [
    CheckComponent
  ],
  providers: [
    Web3Service
  ]
})
export class CheckModule { }
