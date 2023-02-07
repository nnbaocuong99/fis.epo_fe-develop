import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { forkJoin } from 'rxjs';
import { BaseComponent } from '../../../../../../core/_base/component/base-component';
import { NotificationService } from '../../../../../../services/common/notification/notification.service';
import { ProjectRequestPayload } from '../../../../../../services/modules/category/project/project.request.payload';
import { ProjectService } from '../../../../../../services/modules/category/project/project.service';
import { EContractRequestPayload } from '../../../../../../services/modules/contract/contract.request.payload';
import { ContractService } from '../../../../../../services/modules/contract/contract.service';
import { DialogRef } from '../../../../../partials/content/crud/dialog/dialog-ref.model';
import { ListContractComponent } from './list-contract/list-contract.component';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'input-contract',
  templateUrl: './input-contract.component.html',
  styleUrls: ['./input-contract.component.scss']
})
export class InputContractComponent extends BaseComponent implements OnInit {
  @Output() onselect: EventEmitter<any> = new EventEmitter();
  public dialogRef: DialogRef = new DialogRef();
  public request = new EContractRequestPayload();

  constructor(
    private notificationService: NotificationService,
    private projectService: ProjectService,
    private contractService: ContractService
  ) {
    super();
  }

  ngOnInit() {
  }

  public onSelectContract(contractComp: ListContractComponent): void {
    if (contractComp.selectedContract) {

      const requestProject: any = { code: contractComp.selectedContract.afContractId };
      const requestProjectJira: any = { afCode: contractComp.selectedContract.afContractId };

      const requests = [
        this.projectService.count(requestProject),
        this.contractService.searchProjectFromJira(requestProjectJira)
      ];

      const sub = forkJoin(requests).subscribe(
        (response: any[]) => {
          if (response[0] > 0) {
            if (response[1] && response[1].length > 0) {
              contractComp.selectedContract.overSixWeeks = 1; // có dự án trên Jira là hợp đồng trên 6 tuần
              if (!contractComp.selectedContract.pm) {
                contractComp.selectedContract.pm = response[1].pm; // econtract không có PM thì lấy của Jira
              }
            }
            this.onselect.emit(contractComp.selectedContract);
            this.dialogRef.hide();
          } else {
            this.notificationService.showMessage('Mã dự án chưa được đồng bộ về ePO');
          }
        });
      this.subscriptions.push(sub);

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
    contractComp.selectedContract = null;
    contractComp.initData();
  }
  public onCloseDialog(): void {
    this.dialogRef.hide();
  }
}

