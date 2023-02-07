import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NotificationService } from '../../../../../../services/common/notification/notification.service';
import { EContractRequestPayload } from '../../../../../../services/modules/contract/contract.request.payload';
import { DialogRef } from '../../../../../partials/content/crud/dialog/dialog-ref.model';
import { ListContractComponent } from './list-contract/list-contract.component';

@Component({
  selector: 'input-contract',
  templateUrl: './input-contract.component.html',
  styleUrls: ['./input-contract.component.scss']
})
export class InputContractComponent implements OnInit {
  @Output() onselect: EventEmitter<any> = new EventEmitter();
  public dialogRef: DialogRef = new DialogRef();
  public request = new EContractRequestPayload();

  constructor(
    private notificationService: NotificationService,
  ) { }

  ngOnInit() {
  }

  public onSelectContract(contractComp: ListContractComponent): void {
    if (contractComp.selectedContract) {
      this.onselect.emit(contractComp.selectedContract);
      this.dialogRef.hide();
    } else {
      const message = 'Vui lòng chọn hợp đồng đầu ra';
      this.notificationService.showMessage(message);
      return;
    }
     }

  public onSearchContract(contractComp: ListContractComponent): void {
    Object.assign(contractComp.request, this.request);
    contractComp.paginator.pageIndex = 0;
    contractComp.initData();
  }

  public onChangeInput(contractComp: ListContractComponent): void {
    if ((!this.request.contractNumber || this.request.contractNumber === '')
      && (!this.request.accountingCode || this.request.accountingCode === '')
      && (!this.request.pmAcc || this.request.pmAcc === '')) {
      this.onSearchContract(contractComp);
    }
  }

  public onDlgShow(contractComp: ListContractComponent): void {
    this.request.contractNumber = null;
    this.request.accountingCode = null;
    this.request.pmAcc = null;
    Object.assign(contractComp.request, this.request);
    contractComp.paginator.pageIndex = 0;
    contractComp.initData();
  }
  public onCloseDialog(): void {
    this.dialogRef.hide();
  }
}

