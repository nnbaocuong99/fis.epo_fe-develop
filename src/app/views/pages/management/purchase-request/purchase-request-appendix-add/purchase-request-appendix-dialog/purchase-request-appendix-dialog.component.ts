import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseFormComponent } from '../../../../../../core/_base/component/base-form.component';
import { NotificationService } from '../../../../../../services/common/notification/notification.service';
import { DepartmentRequestPayload } from '../../../../../../services/modules/category/department/department.request.payload';
import { DepartmentService } from '../../../../../../services/modules/category/department/department.service';
import {
  OperatingUnitRequestPayload
} from '../../../../../../services/modules/category/organization-management/operating-unit/operating-unit.request.payload';
import {
  OperatingUnitService
} from '../../../../../../services/modules/category/organization-management/operating-unit/operating-unit.service';
import {
  OrganizationRequestPayload
} from '../../../../../../services/modules/category/organization-management/organization/organization.request.payload';
import { OrganizationService } from '../../../../../../services/modules/category/organization-management/organization/organization.service';
import { PurchaseRequestItemService } from '../../../../../../services/modules/purchase-request-item/purchase-request-item.service';
import { PurchaseRequestService } from '../../../../../../services/modules/purchase-request/purchase-request.service';
import { DialogRef } from '../../../../../partials/content/crud/dialog/dialog-ref.model';
import * as parentConfig from '../../purchase-request.config';
import * as config from '../../purchase-request-add/purchase-request-add.config';
import * as mainConfig from '../../../../../../core/_config/main.config';
import { ContractService } from '../../../../../../services/modules/contract/contract.service';
import {
  PurchaseRequestItemRequestPayload
} from '../../../../../../services/modules/purchase-request-item/purchase-request-item.request-payload';
import { forkJoin } from 'rxjs';
import { TreeNode } from 'primeng/api';
import { DeleteConfirmation } from '../../../../../../services/common/confirmation/delete-confirmation';

@Component({
  selector: 'app-purchase-request-appendix-dialog',
  templateUrl: './purchase-request-appendix-dialog.component.html',
  styleUrls: ['./purchase-request-appendix-dialog.component.scss']
})
export class PurchaseRequestAppendixDialogComponent extends BaseFormComponent implements OnInit {
  @ViewChild('form', { static: true }) form: NgForm;
  @Input() dialogRef: DialogRef;
  @Output() success: EventEmitter<any> = new EventEmitter();
  public dialogRefUpdateItem: DialogRef = new DialogRef();
  public isShowDialogUpdateItem = false;
  public formTitle = 'PURCHASE_REQUEST.HEADER_EDIT';
  public purchaseRequestData: any = {};

  public selectedPurchaseRequestItems: any = [];
  public prTypeTemp = parentConfig.PR_TYPE;
  public header = config.HEADER;
  public mainConfig: any = mainConfig.MAIN_CONFIG;
  public headerOperatingUnit = config.HEADER_OPERATING_UNIT;
  public headerOrg = config.HEADER_ORG;
  public headerDepartment = config.HEADER_DEPARMENT;
  public departmentRequestPayload = new DepartmentRequestPayload();
  public requestItem = new PurchaseRequestItemRequestPayload();
  public operatingUnitRequestPayload = new OperatingUnitRequestPayload();
  public organizationRequestPayload = new OrganizationRequestPayload();
  public dataSource = {
    items: null,
    paginatorTotal: undefined,
  };
  public prIdCurrent: string;
  public prContractInfo = parentConfig.PR_CONTRACT_INFO;
  public status: string;

  constructor(
    public purchaseRequestService: PurchaseRequestService,
    private purchaseRequestItemService: PurchaseRequestItemService,
    public operatingUnitService: OperatingUnitService,
    public organizationService: OrganizationService,
    private contractService: ContractService,
    public departmentService: DepartmentService,
    private route: ActivatedRoute,
    public notificationService: NotificationService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
  }

  public onChangeSelectPrType(value: any) {
    this.prContractInfo = parentConfig.PR_CONTRACT_INFO;
    if (value) {
      if (+value === 1) {
        this.prContractInfo = this.prContractInfo.filter(m => m.value !== 3);
      }
      if (+value === 2) {
        this.prContractInfo = this.prContractInfo.filter(m => m.value === 3);
      }
      if (!this.purchaseRequestData.id) {
        this.purchaseRequestData.prType = null;
      }
    }
  }

  public onBtnCancelClick(): void {
    this.redirectToParentPage();
  }

  private redirectToParentPage(): void {
    this.router.navigate(['list'], { relativeTo: this.route.parent });
  }

  private checkExistsInArray(arr: any, item: any): boolean {
    for (const obj of arr) {
      if (item.id === obj.id) {
        return true;
      }
    }
    return false;
  }

  public getListItemSave(poId: string): any {
    const arrDataSave = [];
    for (const item of this.selectedPurchaseRequestItems) {
      if (!this.checkExistsInArray(arrDataSave, item.data)) {
        item.data.prId = poId;
        delete item.data.id;
        arrDataSave.push(item.data);
      }
    }
    return arrDataSave;
  }

  public onBtnSaveClick(): void {
    if (!this.dialogRef.input.id) {
      delete this.purchaseRequestData.id; // thêm mới thì xóa id
      this.purchaseRequestData.appendix = true;
    }
    const saveSub = this.purchaseRequestService.merge(
      this.purchaseRequestData
    ).subscribe((res) => {
      if (this.selectedPurchaseRequestItems.length > 0) {
        const listItemSave = this.getListItemSave(res.id);
        this.purchaseRequestItemService.bulkMerge(listItemSave).subscribe();
      }
      this.notificationService.showSuccess();
      this.dialogRef.hide();
      this.success.emit(res);
    });
    this.subscriptions.push(saveSub);
  }

  public loadNodes(event?: any): void {
    if (!this.requestItem.prId) {
      return;
    }
    this.requestItem.pageIndex = event ? event.first / event.rows : 0;
    this.requestItem.pageSize = event ? event.rows : 10;

    this.dataSource.items = [];

    const purchaseRequestItemSub = forkJoin([
      this.purchaseRequestItemService.select(this.requestItem),
      this.purchaseRequestItemService.count(this.requestItem)
    ]).subscribe(res => {
      this.dataSource.paginatorTotal = res[1];
      const parentItems = res[0].filter(x => !x.isSubItem);
      for (const parent of parentItems) {
        const node: TreeNode = {
          data: { ...parent },
          children: [],
          leaf: true
        };
        const childItems = res[0].filter(x => x.isSubItem && this.quote(x.indexNo).startsWith(this.quote(parent.indexNo)));
        for (const child of childItems) {
          const childNode = {
            data: { ...child },
            leaf: true,
          };

          node.children.push(childNode);
          node.leaf = false;
        }

        this.dataSource.items.push(node);
      }
      this.dataSource.items = [...this.dataSource.items];
      this.cdr.detectChanges();
    });
    this.subscriptions.push(purchaseRequestItemSub);
  }

  private quote(source: string): string {
    return `.${source}.`;
  }

  public addTagFn(name: string) {
    return name;
  }

  public onBtnEditClick(rowData?: any, rowNode?: TreeNode): void {
    this.isShowDialogUpdateItem = false;
    this.cdr.detectChanges();
    if (rowData) {
      const strRowData = JSON.stringify(rowData);
      const objRowData = JSON.parse(strRowData);
      objRowData.currencyDto = {
        code: objRowData.currency
      };
      const params = {
        id: objRowData.id,
        rowData: objRowData,
        rowNode
      };
      this.isShowDialogUpdateItem = true;
      this.dialogRefUpdateItem.input = params;
      this.dialogRefUpdateItem.show();
      this.cdr.detectChanges();
    } else {
      this.isShowDialogUpdateItem = true;
      this.dialogRefUpdateItem.input = {};
      this.dialogRefUpdateItem.show();
    }
  }

  private onLoadItemsInNode(parentNode: any) {

    // xoa du lieu cu
    parentNode.children = [];
    // tao request moi
    const request = new PurchaseRequestItemRequestPayload();
    request.prId = this.requestItem.prId;
    request.isSubItem = true;
    request.subIndexNo = parentNode.data.indexNo;
    // call api lay du lieu
    const purchaseRequestItemSub = this.purchaseRequestItemService.select(request).subscribe(res => {
      for (const element of res) {
        const node = {
          data: {
            ...element
          }
        };
        parentNode.children.push(node);
      }
      this.dataSource.items = [...this.dataSource.items];
      this.cdr.detectChanges();
    });
    this.subscriptions.push(purchaseRequestItemSub);
  }

  public onBtnDeleteClick(rowData?: any, rowNode?: TreeNode): void {
    const confirmation = new DeleteConfirmation();
    confirmation.accept = () => {
      this.purchaseRequestItemService
        .delete(rowData.id)
        .subscribe((res) => {
          this.notificationService.showSuccess();
          if (!rowNode.parent) {
            this.loadNodes(null);
          } else {
            this.onLoadItemsInNode(rowNode.parent);
          }
          this.cdr.detectChanges();
        });
    };
    this.notificationService.confirm(confirmation);
  }

  public onChangeLegal(data: any) {
    this.purchaseRequestData.legal = data.ouId;
    this.organizationRequestPayload.ouId = data.ouId;
  }

  public onChangeOrgApply(data: any) {
    this.purchaseRequestData.orgApply = data.code;
  }

  public changeAmAccount(event) {
    if (event) {
      this.purchaseRequestData.amAccount = event.join(',');
    }
  }

  public changePmAccount(event) {
    if (event) {
      this.purchaseRequestData.pmAccount = event.join(',');
    }
  }
}
