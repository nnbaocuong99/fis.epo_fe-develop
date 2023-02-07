import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { forkJoin } from 'rxjs';
import { take } from 'rxjs/operators';
import { currentUser } from '../../../../../../core/auth';
import { AppState } from '../../../../../../core/reducers';
import { BaseFormComponent } from '../../../../../../core/_base/component';
import * as mainConfig from '../../../../../../core/_config/main.config';
import { NotificationService } from '../../../../../../services/common/notification/notification.service';
import {
  ShipmentQualityItemServiceRequestPayload
} from '../../../../../../services/modules/shipment-quality-item/shipment-quality-item.request-payload';
import { ShipmentQualityItemService } from '../../../../../../services/modules/shipment-quality-item/shipment-quality-item.service';
import { ShipmentQualityService } from '../../../../../../services/modules/shipment-quality/shipment-quality.service';
import { UserRequestPayload } from '../../../../../../services/modules/user/user-request.payload';
import { UserService } from '../../../../../../services/modules/user/user.service';
import { DialogRef } from '../../../../../partials/content/crud/dialog/dialog-ref.model';
import { DialogUploadFileComponent } from '../../../../../partials/control/upload-file/upload-file.component';
import * as config from '../../license-conformity.config';

@Component({
  selector: 'app-shipment-quality-item',
  templateUrl: './shipment-quality-item.component.html',
  styleUrls: ['./shipment-quality-item.component.scss']
})
export class ShipmentQualityItemComponent extends BaseFormComponent implements OnInit {
  @ViewChild(DialogUploadFileComponent, { static: false }) private importFile: DialogUploadFileComponent;
  @ViewChild('form', { static: true }) form: NgForm;
  @Output() success: EventEmitter<any> = new EventEmitter();
  @Input() dialogRef: DialogRef;
  public requestPoItem = new ShipmentQualityItemServiceRequestPayload();
  public userRequestPayload = new UserRequestPayload();
  public dataSource = {
    items: null,
    paginatorTotal: undefined,
  };
  public selectedPurchaseOrderItems: any = {};
  public cols = config.HEADER_ITEM;
  public headerUser = config.HEADER_USER;
  public mainConfig = mainConfig.MAIN_CONFIG;
  public listPoItemIdSelect: any;
  public shipmentQualityData: any = {};
  public currentShipmentQualityId: string;
  public shipmentQualityDataOrigin: any = {};


  constructor(
    public shipmentQualityItemService: ShipmentQualityItemService,
    public shipmentQualityService: ShipmentQualityService,
    public userService: UserService,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService,
    private store: Store<AppState>
  ) {
    super();
  }

  ngOnInit() {
    if (this.dialogRef.input.rowData) {
      this.currentShipmentQualityId = this.dialogRef.input.rowData.id;
      // backup data save tự động khi attach, delete file
      if (this.dialogRef.input.rowData.id) {
        this.shipmentQualityDataOrigin = this.dialogRef.input.rowData;
      } else {
        // Default Ngày đăng ký là ngày hiện tại
        this.dialogRef.input.rowData.submitDate = new Date();
        this.store.select(currentUser).pipe(take(1)).subscribe(res => {
          if (res) {
            this.dialogRef.input.rowData.processBy = res.fullName;
            this.dialogRef.input.rowData.processByDto = this.toDto('fullName', res.fullName);
          }
        });
      }

      this.requestPoItem.shipmentId = this.dialogRef.input.rowData.shipmentId;
    }
    // type - 1: Hiệu xuất năng lượng, 2: Kiểm tra chất lượng, 3: Hợp quy
    this.dialogRef.input.rowData.type = this.dialogRef.input.type;
    if (this.dialogRef.input.rowData.processBy) {
      setTimeout(() => {
        this.dialogRef.input.rowData.processByDto = {
          fullName: this.dialogRef.input.rowData.processBy
        };
      }, 0);
    }
    this.loadNodes();
  }

  public loadNodes(event?: any) {
    this.requestPoItem.pageIndex = event ? event.first / event.rows : 0;
    this.requestPoItem.pageSize = event ? event.rows : 10;
    this.requestPoItem.type = this.dialogRef.input.type;

    const purchaseOrderItemSub = forkJoin([
      this.shipmentQualityItemService.selectPurchaseOderItem(this.requestPoItem),
      this.shipmentQualityItemService.countSelectPurchaseOderItem(this.requestPoItem),
      this.shipmentQualityItemService.selectPoItemId(this.requestPoItem)
    ]).subscribe(res => {
      this.dataSource.items = [];
      // this.dataSource.paginatorTotal = res[1];
      const rs = [];
      const items = res[0];
      const itemsGrouped = this.groupBy(items, 'code');
      const keys = Object.keys(itemsGrouped);
      for (let i = 0; i < keys.length; i++) {
        const node = {
          data: { code: keys[i], id: i.toString(), count: 0 },
          expanded: true,
          children: []
        };
        for (const child of itemsGrouped[keys[i]]) {
          const childNode = {
            data: child,
            leaf: true
          };
          node.children.push(childNode);
        }
        node.data.count = node.children.length;
        rs.push(node);
      }
      this.dataSource.items = rs;
      this.listPoItemIdSelect = res[2];
      if (this.listPoItemIdSelect) {
        this.listPoItemIdSelect.find(x => {
          // Thêm biến để check trường hợp item thực hiện hoàn thành đăng ký, ẩn items không có this.currentShipmentQualityId
          if (x.headerId !== this.currentShipmentQualityId) {
            x.isDisabled = true;
          }
        });
        this.selectedPurchaseOrderItems = [];
        this.listPoItemIdSelect.forEach(element => {
          for (const el of this.dataSource.items) {
            // tslint:disable-next-line:no-unused-expression
            const node = {
              data: el.data,
              expanded: true,
              children: []
            };
            const nodeChil = {
              data: {},
              parent: node,
              leaf: true,
              partialSelected: false
            };
            const item = el.children.find(x => x.data.poItemId === element.poItemId);
            if (item) {
              // Check items đăng ký mới, ẩn các item đã đi dăng ký trước đó
              if (!this.currentShipmentQualityId) {
                item.data.isDisabled = true;
                node.data.isDisabled = true;
              } else {
                // item thực hiện hoàn thành đăng ký, ẩn items không có this.currentShipmentQualityId
                if (item.data.poItemId === element.poItemId && element.isDisabled) {
                  item.data.isDisabled = true;
                } else {
                  item.data.currentShipmentQualityId = this.currentShipmentQualityId;
                }
              }
              node.children.push(item);
              nodeChil.data = item.data;
              if (this.currentShipmentQualityId) {
                this.selectedPurchaseOrderItems.push(node);
              }
              this.selectedPurchaseOrderItems.push(nodeChil);
            }
          }
        });
      }
      this.dataSource.paginatorTotal = res[1];
      this.cdr.detectChanges();
    });
    this.subscriptions.push(purchaseOrderItemSub);
  }

  public groupBy(xs: any[], key: string) {
    return xs.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

  public onBtnSaveClick(): void {
    if (this.form) {
      if (!this.validateForm(this.form, 'role-edit')) {
        return;
      }
      if (this.form.form.dirty) {
        if (!this.dialogRef.input.rowData.finishDate) {
          this.dialogRef.input.rowData.status = 1;
        } else {
          this.dialogRef.input.rowData.status = 2;
        }
        this.shipmentQualityData = this.dialogRef.input.rowData;
        this.shipmentQualityData.shipmentQualityItem = [];
        if (this.selectedPurchaseOrderItems && this.selectedPurchaseOrderItems.length > 0) {
          for (const element of this.selectedPurchaseOrderItems) {
            if (!element.children && element.data) {
              if (this.listPoItemIdSelect) {
                const fn = this.listPoItemIdSelect.find(x => x.poItemId === element.data.poItemId);
                // items thêm mới or items đã tồn tại
                if (!fn || element.data.currentShipmentQualityId) {
                  this.shipmentQualityData.shipmentQualityItem.push(element.data);
                }
              } else {
                this.shipmentQualityData.shipmentQualityItem.push(element.data);
              }
            }
          }
        }

        // lấy danh sách shipmentQualityItem cần update
        if (this.shipmentQualityData.shipmentQualityItem.length > 0) {
          // Dùng biến tạm tránh binding 2 chiều
          const temp = JSON.stringify(this.shipmentQualityData.shipmentQualityItem);
          // Lấy thông tin shipmentQualityItem
          this.shipmentQualityData.shipmentQualityItem = JSON.parse(temp);
          this.shipmentQualityService.merge(this.shipmentQualityData).subscribe(() => {
            this.notificationService.showSuccess();
            this.success.emit();
            this.dialogRef.hide();
          });
        } else {
          this.notificationService.showWarning('Vui lòng chọn items đăng ký để có thể lưu');
          return;
        }
      }
    }
  }

  public onBtnCancelClick(): void {
    this.dialogRef.hide();
  }


  public onChangeAccount(event: any): void {
    if (event) {
      this.dialogRef.input.rowData.processBy = event.fullName;
    }
  }

  public loadDataAttachment(fileInfo: any): void {
    const shipmentQualityData = this.shipmentQualityDataOrigin;
    if (fileInfo) {
      if (shipmentQualityData.docnumber === fileInfo.name && shipmentQualityData.attachment === fileInfo.module) {
        return;
      }
      shipmentQualityData.docnumber = fileInfo.name;
      shipmentQualityData.attachment = fileInfo.module;
    } else {
      shipmentQualityData.docnumber = null;
      shipmentQualityData.attachment = null;
    }
    this.shipmentQualityService.merge(shipmentQualityData).subscribe(() => {
      this.notificationService.showSuccess();
    });
  }

  public onBtnExportFileClick(): void {

  }

  public onViewItemsDetail(): void {
    console.log(1);
  }

  public onHideViewItemsDetail(): void {
    console.log(2);

  }

}
