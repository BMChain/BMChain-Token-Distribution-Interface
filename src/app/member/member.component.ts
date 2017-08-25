import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Web3Service} from "../web3.service";
import {HttpClient} from "@angular/common/http";
import {MessageService} from "../message/message.service";
import {Router, ActivatedRoute, Params} from '@angular/router';
import {I18nService} from "app/core/i18n.service";
import Config from "../../../config/config.json";

declare var require: any;
const _ = require("underscore");
const moment = require("moment");

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss']
})
export class MemberComponent implements OnInit
{
  constructor(private formBuilder : FormBuilder, public web3: Web3Service, private http: HttpClient, private msgService : MessageService, private activatedRoute: ActivatedRoute, public i18nService: I18nService ) {}

  priceUSD: number;
  promo: string;
  showPromoField: boolean = true;
  amount: number = 0.1;

  address: string;
  oldaddress: string = '-';
  utm: any = {};

  get PreICOAddress()
  {
    return Config.PreICOAddress;
  }

  ngOnInit()
  {
    window.scrollTo(0, 0);

    this.http.get("https://api.coinmarketcap.com/v1/ticker/ethereum/").subscribe((data:any)=>{
      console.log("data",data);
      if (data) this.priceUSD = +data[0].price_usd;
    });

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.promo = this.getCookie('r') || params['r'];

      this.utm.source = params['utm_source'];
      this.utm.medium = params['utm_medium'];
      this.utm.campaign = params['utm_campaign'];
      this.utm.term = params['utm_term'];
      this.utm.content = params['utm_content'];
    });

    let savedAddress = localStorage['address'];
    if (savedAddress)
    {
      savedAddress = savedAddress.toString().trim().toLowerCase();
      if (this.web3.isPublicKeyValid(savedAddress))
      {
        this.address = savedAddress;
        this.addressChanges();
        this.showFullContent = true;
      }

    }


  }

  transactions: Array<any> = [];

  total_invested: string;

  getMyTransactions(address: string)
  {
    return new Promise((resolve, reject)=>
    {
      this.http.get(`https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=4156419&endblock=99999999&sort=asc&apikey=FT48RF6DRIYKNNGFFZ2UQUAAZ25R92ZZMM`).subscribe((data:any)=>{
        if (data.status == 1)
        {
          this.transactions = _.chain(data.result)
            .map((x: any)=>{
              x.to = x.to.trim().toLowerCase();
              return x;
            })
            .filter((x: any)=> (x.to == Config.PreICOAddress.toLowerCase()) || (x.to == Config.MKAddress.toLowerCase()))
            .map((x:any)=>{
              if (x.to == Config.MKAddress)
                x.step =  this.i18nService.instant('private_pre_ico');
              else
                x.step = this.i18nService.instant('pre_ico_step');

              x.value = this.web3.web3.utils.fromWei(x.value).toString();
              x.timestamp = moment.unix(+(x.timeStamp)).fromNow();
              x.fulltimestamp = moment.unix(+(x.timeStamp)).toString();
              x.success = (x.isError !== '0')?0:1;
              return x;
            }).value();

          const total_invested = _.reduce(this.transactions, (memo: number, x: any)=> memo + parseFloat(x.value) , 0);
          this.total_invested = total_invested.toFixed(4);

          // console.log("this.transactions",this.transactions);
          resolve(this.transactions);
        }
      });
    });
  }

  balance: any;
  balanceBMT: any = 0;
  isAddressFormUrl: boolean = false;
  addressError: string = '';
  isAgree: boolean = false;
  showFullContent: boolean = false;

  watchBalance(address: string)
  {
    if (this.address === address)
    {
      this.web3.getBalance(this.address).then((balance)=> {
        if (this.address === address)
        {
          this.balance = balance;
          setTimeout(this.watchBalance.bind(this, address), 20 * 1000);
        }
      });
    }
  }

  Invest()
  {
    const promo = (this.promo || '').toUpperCase();

    this.msgService.invest(this.address, this.amount, promo).then((ret: any)=>{
      if (ret.success)
      {
        console.log("success",ret);
        this.msgService.showTransactionMessage(ret.hash);
      }
      else if (!ret.success && ret.error)
      {
        console.log("Error",ret);
        this.msgService.showMessage( this.i18nService.instant('Error'), this.i18nService.instant('unknown_error_try_again'));
      }
    }).catch((e)=>{
      //
    });
  }

  isEditDone()
  {
    return this.oldaddress == this.address;
  }

  isAddressValid()
  {
    return this.addressError == '';
  }

  addressChanges()
  {
    if (this.address) this.address = this.address.trim().toLowerCase();
    if (this.oldaddress != this.address)
    {
      if (this.address) {
        this.addressError = this.web3.getPublicKeyError(this.address);

        if (this.addressError == '')
        {
          localStorage['address'] = this.address;
          this.balance = 0;
          this.balanceBMT = 0;
          this.transactions = [];
          this.watchBalance(this.address);
          this.watchTransactions(this.address);
        }
      }

      this.oldaddress = this.address;
    }
  }

  private watchTransactions(address: string)
  {
    if (this.address === address)
    {
      this.getMyTransactions(this.address).then((transactions:any)=>{
        if (this.address === address)
        {
          this.transactions = transactions;
          setTimeout(this.watchTransactions.bind(this, address), 60 * 1000);
        }
      });
    }
  }

  getCookie(name : string)
  {
    const matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }

  Enter()
  {
    const pThis = this;
    if (this.isAgree && this.isAddressValid() && this.address)
    {
      this.showFullContent = true;

      // Statistics for Ad
      const Fingerprint2 = window['Fingerprint2'];
      new Fingerprint2({}).get(function(result: any)
      {
        const fingerprint = result.toString().toLowerCase();
        pThis.utm.source = pThis.getCookie('utm_source') || pThis.utm.source;
        pThis.utm.medium = pThis.getCookie('utm_medium') || pThis.utm.medium;
        pThis.utm.campaign = pThis.getCookie('utm_campaign') || pThis.utm.campaign;
        pThis.utm.content = pThis.getCookie('utm_content') || pThis.utm.content;

        pThis.http.post('https://bmchain.io/statistics', {fingerprint: fingerprint, address: pThis.address, utm: pThis.utm}).subscribe((data:any)=> {
          //console.log("ret", data);
        });
      });
    }
  }
}
