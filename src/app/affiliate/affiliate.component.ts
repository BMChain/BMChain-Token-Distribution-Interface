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
  selector: 'app-affiliate',
  templateUrl: './affiliate.component.html',
  styleUrls: ['./affiliate.component.scss']
})
export class AffiliateComponent implements OnInit
{
  constructor(private formBuilder : FormBuilder,
              private router:Router,
              public web3: Web3Service,
              private http: HttpClient,
              private msgService : MessageService,
              private activatedRoute: ActivatedRoute,
              public i18: I18nService) {}


  priceUSD: number;
  step: number = 0;
  showPromoField: boolean = false;
  amount: any;

  public myWallet: any  = {address: '', promo: '', createpartnerData: {}};

  ngOnInit()
  {
    let savedAddress = localStorage['partner_address'] || localStorage['address'];
    if (savedAddress)
    {
      savedAddress = savedAddress.toString().trim().toLowerCase();
      if (this.web3.isPublicKeyValid(savedAddress))
      {
        this.myWallet.address = savedAddress;
        this.checkAddress();
      }
    }
  }

  referrals: Array<any> = [];

  date(timestamp: number)
  {
    return moment(timestamp * 1000).fromNow();
  }

  toETH(wei: any)
  {
    wei = wei || '0';
    return this.web3.web3.utils.fromWei(wei.toString());
  }

  checkAddress()
  {
    if (this.myWallet.address != this.myWallet.old_address  && this.web3.isPublicKeyValid(this.myWallet.address))
    {
      localStorage['partner_address'] = this.myWallet.address;
      this.myWallet.old_address = this.myWallet.address;
      this.myWallet.isPartner = false;
      this.myWallet.promo     = '';
      this.watchBalance(this.myWallet.address);

      this.myWallet.createpartnerData.address = this.myWallet.address;

      this.web3.checkPartner(this.myWallet.address).then((x: any)=>
      {
        this.myWallet.isPartner = x.isPartner;
        if (x.isPartner)
        {
          this.myWallet.promo = x.promo;
          this.web3.partnerinfo({address: this.myWallet.address}).then((data: any)=>{
            this.myWallet.totalInvestments = data.totalInvestments;
            this.referrals = data.referrals;
          })
        }
        else
        {
          this.generateUniquePromo();
        }
      });
    }
  }

  public showReferralsDone()
  {

  }

  isVerifedAccount()
  {
    return this.web3.isPublicKeyValid(this.myWallet.address);
  }

  getPartnerInfo()
  {
    if(this.isVerifedAccount())
    {
      const options = {privateKey : this.myWallet.privateKey};

      this.web3.partnerinfo(options).then((res: any) => {
        console.log(res);
        if(res[0]!== undefined && res[0] !== '' && res[0] !== '0' && res[0].indexOf('ERROR:') === -1 && res[0] !== '-1') {
          this.myWallet.promo = res[0];
          this.referrals = [];
          for(let i=0; i<res[2].length; i++){
            this.referrals.push({timestamp: moment.unix(+(parseInt(res[2][i]))).fromNow(), address: res[4][i], amount: this.web3.web3.utils.fromWei(res[3][i])});
          }
        }
      }).catch((err: any) => {
        console.log('Result get partner info: ', err);
      });
    }
    setTimeout(this.getPartnerInfo.bind(this), 10 * 1000);
  }


  isPartner()
  {
    return this.myWallet.promo;
  }

  addressError: string;

  // checkwallet()
  // {
  //   const privKeyRegex = /^[0-9a-fA-F]{64}$/;
  //   if (!privKeyRegex.test(this.myWallet.privateKey))
  //   {
  //     this.privateKeyError = 'Приватный ключ имеет некорректный формат';
  //   }
  //   else
  //   {
  //     const publicKeyRegex = /^0x[0-9a-fA-F]{40}$/;
  //     if (!publicKeyRegex.test(this.myWallet.address))
  //     {
  //       this.addressError = 'Открытый ключ имеет некорректный формат';
  //     }
  //     else
  //     {
  //       const generatedAddress = this.web3.privateKeyToAddress(this.myWallet.privateKey).toLowerCase();
  //       const userAddress = this.myWallet.address.toString().toLowerCase();
  //       if (generatedAddress === userAddress)
  //       {
  //         this.myVerifiedWallet.address = this.myWallet.address;
  //         this.myVerifiedWallet.privateKey = this.myWallet.privateKey;
  //
  //         this.getPartnerInfo();
  //
  //
  //         this.web3.getBalance(this.myVerifiedWallet.address).then((balance)=> this.myVerifiedWallet.balance = balance);
  //         setTimeout(this.watchBalance.bind(this, this.myVerifiedWallet.address), 10 * 1000);
  //
  //         // this.msgService.showMessage('Информация', 'Всё в порядке !');
  //         this.privateKeyError = '';
  //         this.addressError = '';
  //       }
  //       else
  //       {
  //         this.privateKeyError = 'Приватный ключ не соответсвует указанному адресу';
  //       }
  //     }
  //   }
  // }

  watchBalance(address: string)
  {
    if (this.myWallet.address === address)
    {
      this.web3.getBalance(this.myWallet.address).then((balance)=> {
        if (this.myWallet.address === address)
        {
          this.myWallet.balance = balance;
          setTimeout(this.watchBalance.bind(this, address), 10 * 1000);
        }
      });
    }
  }

  is_generate: boolean = false;
  isNewWallet()
  {
    return this.is_generate === true;
  }

  // GenerateNew()
  // {
  //   this.myWallet = this.web3.generateNewAccount();
  //   this.is_generate = true;
  //   this.myWallet = {address: '', privateKey: '', balance: 0, promo: ''};
  //   this.web3.getBalance(this.myWallet.address).then((balance)=>{
  //     this.myWallet.balance = balance;
  //   }).catch((err)=>{
  //     console.log("err",err);
  //   })
  // }

  showBtnCreate: boolean = true;

  generatePromo() : string
  {
    let new_promo = '';
    let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for(let i = 0;i < 6; i++)
    {
      let rnum = Math.floor(Math.random() * (chars.length - 2));
      new_promo += chars.substring(rnum, rnum + 1);
    }
    return new_promo;
  }

  generateUniquePromo()
  {
    if(this.isVerifedAccount())
    {
      let new_promo = this.generatePromo();

      this.web3.checkPromo(this.myWallet.address, new_promo).then((res: boolean) => {
        if(res){
          this.generateUniquePromo();
        }
        else
        {
          this.myWallet.createpartnerData.promo = new_promo;
        }
      }).catch((err: any) =>
      {
        // this.generateUniquePromo();
        // console.log('Result get partner info: ', err);
        this.msgService.showMessage('Ошибка', err.error);
      });
    }
  }

  JoinAsPartner()
  {
    this.msgService.showPartnerMessage(this.myWallet.address, this.myWallet.createpartnerData.promo).then((ret: any)=>{
      if (ret.success)
      {
        this.msgService.showTransactionMessage(ret.hash);
        this.watchForPartner(this.myWallet.address);
      }
      else
      {
        //this.msgService.showMessage(this.i18.instant('Error'), this.i18.instant('unknown_error_try_again'));
      }
    });
  }

  private watchForPartner(address: string)
  {
    if (address != this.myWallet.address) return;

    this.web3.checkPartner(this.myWallet.address).then((x: any)=>
    {
      this.myWallet.isPartner = x.isPartner;
      if (x.isPartner)
      {
        this.myWallet.promo = x.promo;
        this.web3.partnerinfo({address: this.myWallet.address}).then((data: any)=>{
          this.myWallet.totalInvestments = data.totalInvestments;
          this.referrals = data.referrals;
        })
      }
      else
      {
        setTimeout(this.watchForPartner.bind(this, address), 5000);
      }
    });
  }
}
