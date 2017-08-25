import {EventEmitter, Injectable, Input, Output} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {MessageComponent} from "./message.component";
import {I18nService} from "../core/i18n.service";

@Injectable()
export class MessageService
{
  constructor(private modalService: NgbModal, private i18nService: I18nService) {}

  public showMessage(title: string, message: string)
  {
    const modalRef = this.modalService.open(MessageComponent);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    return modalRef.result;
  }

  public showTransactionMessage(hash: string)
  {
    const modalRef = this.modalService.open(MessageComponent);
    modalRef.componentInstance.title = this.i18nService.instant("success");
    modalRef.componentInstance.type = "transaction";
    modalRef.componentInstance.hash = hash;
    return modalRef.result;
  }

  public validatePrivatekeyMessage(userAddress:string , generatedAddress: string )
  {
    const modalRef = this.modalService.open(MessageComponent);
    const title = (userAddress === generatedAddress) ? "checking_done_success": "error";
    modalRef.componentInstance.title = this.i18nService.instant(title);

    modalRef.componentInstance.userAddress = userAddress;
    modalRef.componentInstance.generatedAddress = generatedAddress;
    modalRef.componentInstance.classTitle = (userAddress === generatedAddress) ? "success": "error";
    modalRef.componentInstance.type = "validate";
    return modalRef.result;
  }

  public invest(address: string, amount:number, promo: string )
  {
    const modalRef = this.modalService.open(MessageComponent, {size: 'lg'});
    modalRef.componentInstance.title = this.i18nService.instant("sending_eth_to_smart_contract");
    modalRef.componentInstance.invest.amount = amount;
    modalRef.componentInstance.invest.promo = promo;
    modalRef.componentInstance.invest.verifiedAddress = (address || '').trim().toLowerCase();
    modalRef.componentInstance.invest.address = (address || '').trim().toLowerCase();
    modalRef.componentInstance.type = "invest";
    modalRef.componentInstance.checkTransaction();
    return modalRef.result;
  }

  public showPartnerMessage(address: string, promo: string)
  {
    const modalRef = this.modalService.open(MessageComponent, {size: 'lg'});
    modalRef.componentInstance.title = this.i18nService.instant("register_as_partner");
    modalRef.componentInstance.partner.promo = promo;
    modalRef.componentInstance.partner.address = (address || '').trim().toLowerCase();
    modalRef.componentInstance.type = "partner";
    return modalRef.result;
  }
}
