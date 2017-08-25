import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Web3Service} from "../web3.service";
import {HttpClient} from "@angular/common/http";
import {MessageService} from "../message/message.service";
import { ActivatedRoute, Params, Route} from '@angular/router';
import {Router} from "@angular/router";
import {I18nService} from "../core/i18n.service";
declare var require: any;
const _ = require("underscore");
const moment = require("moment");

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.scss']
})
export class CheckComponent implements OnInit
{
  constructor(private formBuilder : FormBuilder,
              private router:Router,
              public web3: Web3Service,
              private http: HttpClient,
              private msgService : MessageService,
              private activatedRoute: ActivatedRoute,
              public i18nService: I18nService) {}


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
    window.scrollTo(0, 0);

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

  transactions: Array<any> = [];

  getMyTransactions(address: string)
  {
    // api
    this.http.get(`http://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=4180921&endblock=99999999&sort=asc&apikey=FT48RF6DRIYKNNGFFZ2UQUAAZ25R92ZZMM`).subscribe((data:any)=>{
      if (data.status == 1)
      {
        this.transactions = _.chain(data.result)
                             .filter((x: any)=> x.to == this.web3.PreICOAddress)
          .map((x:any)=>{
                    x.value = this.web3.web3.utils.fromWei(x.value);
                    x.timestamp = moment(x.timestamp * 1000).fromNow();
          }).value();
      }

    });

  }

  GoStep1()
  {
    this.router.navigate(['/']);
  }

  GoToInvestArea()
  {
    if (this.myVerifiedWallet.address)
    {
      this.router.navigate(['/members-area'],{queryParams: {address: this.myVerifiedWallet.address}});
    }
    else
    {
      this.router.navigate(['/members-area']);
    }
  }

  isVerifedAccount()
  {
    return this.myVerifiedWallet.address && this.myVerifiedWallet.privateKey && this.myVerifiedWallet.address === this.myWallet.address && this.myVerifiedWallet.privateKey === this.myWallet.privateKey;
  }

  checkwallet()
  {
    if (!this.web3.isPrivateKeyValid(this.myWallet.privateKey))
    {
      this.msgService.showMessage( this.i18nService.instant('Error'), this.i18nService.instant('priv_key_wrong_format'));
    }
    else
    {
      if (!this.web3.isPublicKeyValid(this.myWallet.address))
      {
        this.msgService.showMessage(this.i18nService.instant('Error'), this.i18nService.instant('pub_key_wrong_format '));
      }
      else
      {
        const generatedAddress = this.web3.privateKeyToAddress(this.myWallet.privateKey).toLowerCase();
        const userAddress = this.myWallet.address.toString().toLowerCase();
        if (generatedAddress === userAddress)
        {
          this.myVerifiedWallet.address = this.myWallet.address;
          this.myVerifiedWallet.privateKey = this.myWallet.privateKey;

          this.getMyTransactions(this.myVerifiedWallet.address);

          this.web3.getBalance(this.myVerifiedWallet.address).then((balance)=> this.myVerifiedWallet.balance = balance);
          // setTimeout(this.watchBalance.bind(this, this.myVerifiedWallet), 10 * 1000);

          this.msgService.showMessage(this.i18nService.instant('msg_info'), this.i18nService.instant('all_right'));
        }
        else
        {
          this.msgService.validatePrivatekeyMessage(userAddress, generatedAddress);
        }
      }
    }
  }

  watchBalance(address: string)
  {
    if (this.myVerifiedWallet.address === address)
    {
      this.web3.getBalance(this.myVerifiedWallet.address).then((balance)=> {
        if (this.myVerifiedWallet.address === address)
        {
          this.myVerifiedWallet.balance = balance;
          setTimeout(this.watchBalance.bind(this, address), 10 * 1000);
        }
      });
    }
  }

  GenerateNew()
  {
    this.wallet = this.web3.generateNewAccount();
    this.web3.getBalance(this.wallet.address).then((balance)=>{
      this.wallet.balance = balance;
    }).catch((err)=>{
      console.log("err",err);
    })
  }

}
