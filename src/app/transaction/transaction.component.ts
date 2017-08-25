import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Web3Service} from "../web3.service";
import {Web3NativeService} from "../web3.native.service";
import {TransactionBase} from "../transactionBase";

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit
{
  ttype: number = 0;

  privateKey: string;

  @Input()
  send_transaction_caption: string = "Send transaction";

  @Input()
  requiredPublicAddress: string;

  @Input()
  callFunction: string;

  @Input()
  public data : any;

  @Input()
  public abiContract: any = [];

  @Input()
  public contractAddress: string = '0x123';

  public getABIContractStr()
  {
    return JSON.stringify(this.abiContract);
  }

  constructor(public web3: Web3Service, public web3native: Web3NativeService)
  {
    this.web3native.loadNativeWeb3();
  }

  get currentWeb3() : any
  {
    switch (this.ttype)
    {
      case 1:
      {
        return this.web3;
      }
      case 2:
      {
        return this.web3native;
      }
      default:
        break;
    }
  }

  send()
  {
    const dataToSend = Object.assign({}, this.data);
    let currentService : TransactionBase;
    switch (this.ttype)
    {
      case 1:
      {
        dataToSend.privateKey = this.privateKey;
        currentService = this.web3;
        break;
      }
      case 2:
      {
        currentService = this.web3native;
        break;
      }
    }

    currentService[this.callFunction](dataToSend).then((ret: any)=>
    {
      console.log("ret", ret);
      this.done.emit({success: true, hash:ret});
    }).catch((err: any)=>{
      console.log("err", err);
      this.done.emit({success: false, err: err});
    });
  }

  @Output()
  public done :EventEmitter<any> = new EventEmitter<any>();

  ngOnInit()
  {

  }

  isAllowToSendTransaction() : boolean
  {
    switch (this.ttype)
    {
      case 1:
      {
        return this.web3.isPrivateKeyValid(this.privateKey);
      }
      case 2:
      {
        return this.web3native.isNativeInstalled();
      }
    }
    return false;
  }
}
