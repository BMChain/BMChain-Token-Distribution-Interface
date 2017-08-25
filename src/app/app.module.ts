import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { CoreModule } from './core/core.module';
import { HomeModule } from './home/home.module';
import {MessageService} from "./message/message.service";
import {MessageComponent} from "./message/message.component";
import {Web3Service} from "./web3.service";
import {MemberModule} from "./member/member.module";
import {AffiliateModule} from "./affiliate/affiliate.module";
import {CheckModule} from "./check/check.module";
import {TransactionComponent} from "./transaction/transaction.component";
import {TransactionModule} from "./transaction/transaction.module";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    NgbModule,
    HttpModule,
    TranslateModule.forRoot(),
    CoreModule,
    HomeModule,
    MemberModule,
    AffiliateModule,
    CheckModule,
    TransactionModule,
    AppRoutingModule // should be last !
  ],
  declarations: [AppComponent, MessageComponent],
  providers: [ MessageService],
  entryComponents: [MessageComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
