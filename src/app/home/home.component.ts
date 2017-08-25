import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Web3Service} from "../web3.service";
import {HttpClient} from "@angular/common/http";
import {MessageService} from "../message/message.service";
import { ActivatedRoute, Params, Route} from '@angular/router';
import {Router} from "@angular/router";
declare var require: any;
const _ = require("underscore");
const moment = require("moment");

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit
{
  constructor(private formBuilder : FormBuilder, private router:Router, public web3: Web3Service, private http: HttpClient, private msgService : MessageService, private activatedRoute: ActivatedRoute )
  {

  }

  priceUSD: number;
  step: number = 0;
  promo: any;
  showPromoField: boolean = false;
  amount: any;
  myWallet: any  = {address: '', privateKey: '', balance: 0};
  myVerifiedWallet: any  = {address: '', privateKey: '', balance: 0};
  wallet: any  = {address: '', privateKey: '', balance: 0};

  ngOnInit()
  {
    this.http.get("https://api.coinmarketcap.com/v1/ticker/ethereum/").subscribe((data:any)=>{
      console.log("data",data);
      if (data) this.priceUSD = +data[0].price_usd;
    });

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.promo = params['r'];
      if (!params['r']) {
        this.showPromoField = true;
      }
    });

    this.GenerateNew();
  }

  GoStep2()
  {
    this.router.navigate(['/check']);
    this.GenerateNew();
  }

  GoToInvestArea()
  {
    this.router.navigate(['/members-area']);
  }

  isVerifedAccount()
  {
    return this.myVerifiedWallet.address === this.myWallet.address && this.myVerifiedWallet.privateKey === this.myWallet.privateKey;
  }

  GenerateNew()
  {
    this.wallet = this.web3.generateNewAccount();
  }

}
