import {EventEmitter, Injectable, Input, Output} from '@angular/core';
import {I18nService} from "./core/i18n.service";
import {TransactionBase} from "./transactionBase";
import Config from "../../config/config.json";

declare var require: any;
declare const Buffer:any;
const Tx = require('ethereumjs-tx');
const ethUtil = require('ethereumjs-util');
// TODO:
let Web3;

@Injectable()
export class Web3NativeService implements TransactionBase
{
  constructor()
  {
  }

  public buy(options: any)
  {
    // address: string, amount: number, promo: string, gasAmount: number, gasPrice: string
    const amountInWei = this.web3.utils.toWei(options.amount).toString();


    return this.PreIco.methods.buy(options.promo).send({from:options.address,gasPrice:options.gasPrice, gas : options.gasAmount, value: amountInWei },
      function () {

    });
  }

  public createpartner(options: any)
  {
    return this.AffProgram.methods.setPromoToPartner(options.promo).send({value: 0, from: options.address});
  }

  public web3 : any;

  GetContract(abi:any, address:string)
  {
    if (this.web3.eth.contract)
    {
      var MyContract = this.web3.eth.contract(abi);
      return MyContract.at(address);
    }
    else
    {
      const obj =  new this.web3.eth.Contract(abi, address);
      return obj;
    }
  }

  PreIco: any;

  AffProgram: any;

  public isNativeInstalled(): boolean
  {
    return !!this.web3;
  }

  public get accounts()
  {
    return this.web3.accounts;
  }

  public loadNativeWeb3()
  {
    Web3 = require('./web3/web3');

    const Provider = Web3.givenProvider || (window['web3'] && window['web3'].currentProvider);

    if (Provider && !this.web3)
    {
      this.web3 = new Web3();

      this.web3.setProvider(Provider);

      this.PreIco = this.GetContract(Config.PreICOABI, Config.PreICOAddress);

      this.AffProgram = this.GetContract(Config.AffiliateProgramABI, Config.AffiliateProgramAddress);
    }
  }
}
