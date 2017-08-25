import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { CoreModule } from '../core/core.module';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import {TransactionComponent} from "./transaction.component";
import {Web3Service} from "app/web3.service";
import {Web3NativeService} from "../web3.native.service";

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [TransactionComponent],
  exports: [TransactionComponent],
  entryComponents: [ TransactionComponent],

  providers: [Web3Service, Web3NativeService  ]
})
export class TransactionModule { }
