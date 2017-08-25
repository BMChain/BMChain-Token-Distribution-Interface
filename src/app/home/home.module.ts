import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { CoreModule } from '../core/core.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { DateTimePickerModule } from 'ng-pick-datetime';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import {Web3Service} from "../web3.service";
import {BrowserModule} from "@angular/platform-browser";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    CoreModule,
    HomeRoutingModule,
    DateTimePickerModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule
  ],
  declarations: [
    HomeComponent
  ],
  providers: [
    Web3Service
  ]
})
export class HomeModule { }
