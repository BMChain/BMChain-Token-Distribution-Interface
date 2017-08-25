import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Web3Service} from "../web3.service";
import {MessageService} from "./message.service";
import {I18nService} from "../core/i18n.service";
declare var require: any;
const BigNumber = require("bignumber.js");

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  @Input()
  title: string;

  @Input()
  message: string;

  @Input()
  hash: string;

  @Input()
  type: string = 'normal';

  @Input()
  public classTitle: string = '';

  @Input()
  public userAddress: string = '';

  @Input()
  public generatedAddress: string = '';

  private ether_in_wei = (new BigNumber(10)).pow(18);

  public invest: any = {privateKey: '' , balance: 0, amount: 0, address: '', promo: '', gasAmount: 0, gasPrice: 0, comission: 0, fullAmount: 0, manualEdit: false, verifiedAddress: ''};

  public partner: any = {};

  eth(value:any)
  {
    value = value || 0;
    value = new BigNumber(value.toString());
    return value.div(this.ether_in_wei).toNumber();
  }

  constructor(public activeModal: NgbActiveModal, public web3: Web3Service, public i18 : I18nService) { }

  ngOnInit()
  {

  }

  public checkTransaction()
  {
    const pThis = this;
    pThis.invest.gasAmount = null;
    pThis.invest.checkingDone = false;
    this.web3.isCanBuy(this.invest.address, this.invest.amount, this.invest.promo || '').then((info: any)=>
    {
      // console.log("info", info);

      pThis.invest.gasAmount = info.gasAmount;
      pThis.invest.gasPrice = info.gasPrice;

      const weiAmount = pThis.web3.web3.utils.toWei(pThis.invest.amount);
      // console.log("weiAmount", weiAmount);
      const weiComission = (new BigNumber(pThis.invest.gasAmount.toString())).mul(new BigNumber(pThis.invest.gasPrice.toString()));
      // console.log("weiComission", weiComission);
      pThis.invest.comission = pThis.web3.web3.utils.fromWei(weiComission);
      // console.log("this.comission", pThis.comission);
      this.invest.fullAmount = pThis.web3.web3.utils.fromWei((new BigNumber(weiAmount.toString())).plus(weiComission));

      this.web3.getBalance(this.invest.address).then((balance: any)=>{
        pThis.invest.balance = balance;

        pThis.invest.fundsLeft = (new BigNumber(balance)).minus(pThis.invest.fullAmount).toNumber();

        pThis.invest.checkingDone = true;
      }).catch((err:any)=>{
        pThis.invest.checkingDone = true;
      });
    }).catch((err:any)=>
    {
      pThis.invest.gasAmount = -1;
      pThis.invest.checkingDone = true;
    });
  }

  sendTransaction()
  {
      const options = {address :    this.invest.address,
                       privateKey : this.invest.privateKey,
                       amount:      this.invest.amount,
                       promo:       this.invest.promo || '',
                       gasAmount:   this.invest.gasAmount,
                       gasPrice:    this.invest.gasPrice};

      this.web3.buy(options).then((hash: any)=>{
        this.activeModal.close({success: true , hash:hash});
      }).catch((err: any)=>{
        this.activeModal.close({success: false, error: JSON.stringify(err)});
      })
  }

  isPrivateKeyvalid(privateKey: string) :boolean
  {
    return this.web3.isPrivateKeyValid(privateKey);
  }

  investDone(data: any)
  {
    this.activeModal.close(data);
  }

  createPartnerDone(data: any)
  {
    this.activeModal.close(data);
  }
  // privateKeyChanges(privateKey: string)
  // {
  //   if (this.isPrivateKeyvalid(privateKey))
  //   {
  //     this.invest.address = this.web3.privateKeyToAddress(privateKey).trim().toLowerCase();
  //     this.checkTransaction();
  //   }
  // }
}
