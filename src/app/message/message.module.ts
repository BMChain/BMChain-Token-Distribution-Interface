import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {MessageService} from "./message.service";
import {RouterModule} from "@angular/router";
import {Web3Service} from "../web3.service";
import {TransactionComponent} from "../transaction/transaction.component";
import {TransactionModule} from "../transaction/transaction.module";

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    NgbModule.forRoot(),
    ReactiveFormsModule,
    RouterModule,
    TransactionModule
  ],
  providers: [ MessageService,Web3Service ],
  exports: [],
  declarations: [  ]
})
export class MessageModule { }
