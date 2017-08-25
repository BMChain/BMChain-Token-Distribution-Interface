import {EventEmitter, Injectable, Input, Output} from '@angular/core';
import {I18nService} from "./core/i18n.service";
import {TransactionBase} from "./transactionBase";
import Config from "../../config/config.json";

declare var require: any;
// const ethUtil = require('ethereumjs-util');
// const BigNumber = require("bignumber.js");
declare const Buffer:any;
const Tx = require('ethereumjs-tx');
const Web3 = require('./web3/web3');

@Injectable()
export class Web3Service implements TransactionBase
{
  constructor(private i18nService: I18nService)
  {
    this.keythereum = window['keythereum'];

    if (Math.random() >= 0.5)
    {
      this.loadWeb3(Config.Nodes[0]);
    }
    else
    {
      this.loadWeb3(Config.Nodes[1]);
    }
  }

  private signAndSendTransaction = function (payloadData: any, from: string, to: string, privateKey: string, value:any, gasLimit: any, gasPrice: any)
  {
    return new Promise((resolve, reject)=>
    {
      let bufferPrivateKey = Buffer.from(privateKey, 'hex');

      this.web3.eth.getTransactionCount(from).then((nonce: number)=>
      {
          var rawTx = {
            nonce: this.web3.utils.toHex(nonce),
            gasPrice: this.web3.utils.toHex(gasPrice),
            gasLimit: this.web3.utils.toHex(gasLimit),
            to: to,
            from: from,
            value: this.web3.utils.toHex(value),
            data: payloadData
          };

          // console.log("rawTx", rawTx);

          let tx = new Tx(rawTx);
          tx.sign(bufferPrivateKey);

          let serializedTx = tx.serialize();

          return this.web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), (err:any, hash:any)=>
          {
            if (err)
              reject(err);
            else
              resolve(hash);

          });
      }).catch(reject);
    });
  }

  public isCanBuy(address: string, amount: number, promo: string)
  {
    return new Promise((resolve ,reject)=>
    {
      const amountInWei = this.web3.utils.toWei(amount).toString();

      this.PreIco.methods.buy(promo).estimateGas({from: address, value: amountInWei, gas: 5000000}).then( (gasAmount:any)=>{

        if (gasAmount < 2000000)
        {
          this.web3.eth.getGasPrice().then((gasPrice: any)=>
          {
            resolve({gasAmount:gasAmount + 1000, gasPrice:gasPrice});
          }).catch(reject);
        }
        else
        {
          reject();
        }
      });
    });
  }

  public buy(options:any)
  {
    // address: string, privateKey: string, amount: number, promo: string, gasAmount: number, gasPrice: string
    return new Promise((resolve ,reject)=>{
        if (options.privateKey)
        {
          const check_address = this.privateKeyToAddress(options.privateKey);
          if (check_address.toLowerCase() != options.address.toLowerCase())
          {
            reject({error: "Address not matches"});
            return;
          }
        }

        const amountInWei = this.web3.utils.toWei(options.amount).toString();

        this.signAndSendTransaction(this.PreIco.methods.buy(options.promo).encodeABI(),
                                                        options.address,
                                                        Config.PreICOAddress,
                                                        options.privateKey,
                                                        amountInWei,
                                                        options.gasAmount,
                                                        options.gasPrice).then((hash:any)=>
        {
              resolve(hash);
        }).catch((err:any)=>reject({error: err}));

      });
  }

  public get PreICOABI()
  {
    return Config.PreICOABI;
  }

  public get AffiliateProgramABI()
  {
    return Config.AffiliateProgramABI;
  }

  public get AffiliateProgramAddress()
  {
    return Config.AffiliateProgramAddress;
  }

  public get PreICOAddress()
  {
    return Config.PreICOAddress;
  }

  public checkPartner(address: string)
  {
    return new Promise((resolve, reject)=> {
      this.AffProgram.methods.checkPartner(address).call({from: address}).then((result:any)=>{
        resolve({isPartner:result[0], promo:result[1]});
      }).catch(reject);
    });
  }

  public createpartner(options: any)
  {
    //privateKey: string, promo: string
    return new Promise((resolve ,reject)=>{
      const address = this.privateKeyToAddress(options.privateKey);
      console.log("this.AffProgram", this.AffProgram, this.AffProgram.methods.setPromoToPartner);

      this.AffProgram.methods.setPromoToPartner(options.promo).estimateGas({from: address, value: 0, gas: 5000000}).then( (gasAmount:any)=>{

        if (gasAmount < 200000)
        {
          this.web3.eth.getGasPrice().then((gasPrice: any)=>
          {
            this.signAndSendTransaction(this.AffProgram.methods.setPromoToPartner(options.promo).encodeABI(), address, Config.AffiliateProgramAddress, options.privateKey, 0, gasAmount + 1000, gasPrice).then((hash:any)=>
            {
              resolve(hash);
            }).catch((err:any)=>reject({error: err}));
          }).catch((err:any)=>reject({error: err}));
        }
        else
        {
          reject({error: 'Out of Gas'});
        }
      }).catch((err:any)=>reject({error: err}));
    });
  }

  public checkPromo(address: string, promo: string)
  {
    return new Promise((resolve ,reject)=>
    {
      this.AffProgram.methods.checkPromo(promo).call({from: address}).then((res: boolean) => {
        resolve(res);
      }).catch((err:any)=>reject({error: err}));
    });
  }

  public partnerinfo(options: any)
  {
    // privateKey: string
    return new Promise((resolve ,reject)=>
    {
      try {
        this.AffProgram.methods.partnerInfo(options.address).call({from: '0x32C277d5b58cb03DAC62c3a16dcE9aA734B9d86F'}).then((data: any) =>
        {
          const ret : any = {totalInvestments: data.attracted_investments, referrals: []};
          for(let i=0;i<data.h_datetime.length;i++)
          {
            ret.referrals.push({datetime: data.h_datetime[i], invest: data.h_invest[i], refferal: data.h_referrals[i]});
          }
          resolve(ret);
        }).catch((err: any) => {
          reject({error: err});
        });
      }
      catch (err){
        reject({error: err});
      }
    });
  }

  public web3 : any;
  keythereum: any;

  public generateNewAccount()
  {
    let dk = this.keythereum.create();
    let privateKey = dk.privateKey.toString('hex');
    let address = this.keythereum.privateKeyToAddress(privateKey);
    return {address : address, privateKey: privateKey, balance: -1};
  }

  public getBalance(address: string)
  {
    return new Promise((resolve , reject)=>{
        this.web3.eth.getBalance(address, (err: any, balance: any)=>{
          if (err)
            reject(err);
          else
            resolve((+this.web3.utils.fromWei(balance)).toFixed(4));
        });
    });
  }

  private privKeyRegex: any = /^[0-9a-fA-F]{64}$/;

  public isPrivateKeyValid(pkey: string)
  {
    return this.privKeyRegex.test(pkey);
  }

  public privateKeyToAddress(privatekey : string)
  {
    return this.keythereum.privateKeyToAddress(privatekey);
  }

  // private old_account: string = '';
  //
  // @Input()
  // public get account() : string
  // {
  //   if ( this.web3 && this.web3.eth && this.web3.eth.accounts)
  //   {
  //     const account = this.web3.eth.accounts[0].toString().toLowerCase();
  //
  //     this.old_account = account;
  //     return account;
  //   }else
  //     return '';
  // }

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

  provider: any;

  loadWeb3(provider: any)
  {
      this.web3 = new Web3();

      try
      {
        if (typeof(provider) === 'string') provider = new this.web3.providers.HttpProvider(provider);

        this.web3.setProvider(provider);
        this.provider = provider;
      }
      catch(e)
      {
        // console.log("RPC", e);
        // this.web3.setProvider(new this.web3.providers.HttpProvider("https://mainnet.infura.io/bmchain"));
      }

      this.PreIco = this.GetContract(Config.PreICOABI, Config.PreICOAddress);
      this.AffProgram = this.GetContract(Config.AffiliateProgramABI, Config.AffiliateProgramAddress);
  }

  private publicKeyRegex = /^0x[0-9a-fA-F]{40}$/;

  isPublicKeyValid(address: string) {
    return this.publicKeyRegex.test((address || '').toLowerCase());
  }

  getPublicKeyError(address: string)
  {
    if (!this.isPublicKeyValid(address))
    {
      if (this.isPrivateKeyValid(address))
      {
        return this.i18nService.instant('pub_err_desc1');
      }

      address = address || '';

      if (address.length != 42)
      {
        return this.i18nService.instant('pub_err_desc2');
      }
      if (address.substr(0,2).toLowerCase() != '0x')
      {
        return this.i18nService.instant('pub_err_desc3');
      }

      return this.i18nService.instant('pub_err_desc4');
    }
    return '';
  }

  getPrivateKeyError(pkey: string)
  {
    if (!this.isPrivateKeyValid(pkey))
    {
      if (this.isPublicKeyValid(pkey))
      {
        return this.i18nService.instant('priv_err_desc1');
      }
      if (pkey.length != 64)
      {
        return this.i18nService.instant('priv_err_desc2');
      }
      if (pkey.substr(0,2).toLowerCase() == '0x')
      {
        return this.i18nService.instant('priv_err_desc3');
      }

      return this.i18nService.instant('priv_err_desc4');
    }
    return '';
  }
}
