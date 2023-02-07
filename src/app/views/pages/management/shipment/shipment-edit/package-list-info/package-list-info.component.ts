import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { BaseFormComponent } from '../../../../../../core/_base/component/base-form.component';
import { NotificationService } from '../../../../../../services/common/notification/notification.service';
import { ConfigListFactory } from '../../../../../partials/control/config-list/config-list-control.service';
import * as config from './package-list-info.config';

@Component({
  selector: 'app-package-list-info',
  templateUrl: './package-list-info.component.html',
  styleUrls: ['./package-list-info.component.scss']
})
export class PackageListInfoComponent extends BaseFormComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @Input() form: any;
  @Input() shipmentPackageData: any = {};
  @Input() editTable: boolean;

  public headerPackageList = config.HEADERS_PACKAGE_LIST;
  public validateFields = config.VALIDATE_FIELD;
  public itemQuantityTotal = 0;
  public volumeTotal = 0;
  public weightTotal = 0;
  public grossWeightTotal = 0;
  public packageQuantityTotal = 0;
  public addItem: any = {};
  public configListDataPackageType: any[] = ConfigListFactory.instant('PACKING_TYPE');

  constructor(
    public cdr: ChangeDetectorRef,
    public notification: NotificationService
  ) {
    super();
  }

  ngOnInit() {
  }

  public addNewRow(): void {
    if (this.validateNewRow()) {
      this.shipmentPackageData.items.push({ ... this.addItem });
      this.addItem = {};
      this.getTotal();
      this.form.form.markAsDirty();
      this.cdr.detectChanges();
    }
  }

  public validateNewRow(): boolean {
    let result = true;
    for (const item of this.validateFields) {
      if (item.validateValue.some(x => x === this.addItem[item.field])) {
        this.notification.showMessage(item.message);
        result = false;
        break;
      }
    }
    return result;
  }

  public onRowEditInit(rowData: any): void {
    if (rowData && this.form) {
      this.form.form.markAsDirty();
    }
    this.getTotal();
  }

  public onBtnDeleteRowClick(rowData: any): void {
    const index = this.shipmentPackageData.items.indexOf(rowData);
    this.shipmentPackageData.items.splice(index, 1);
    this.getTotal();
    this.form.form.markAsDirty();
  }

  private getTotal(): void {
    if (this.shipmentPackageData.items.length > 0) {
      let itemQuantityTotal = 0;
      let volumeTotal = 0;
      let weightTotal = 0;
      let grossWeightTotal = 0;
      let packageQuantityTotal = 0;
      for (const item of this.shipmentPackageData.items) {
        itemQuantityTotal += +item.itemQuantity;
        volumeTotal += +item.volume;
        weightTotal += +item.weight;
        grossWeightTotal += +item.grossWeight;
        packageQuantityTotal += +item.packageQuantity;
      }
      this.itemQuantityTotal = itemQuantityTotal;
      this.volumeTotal = volumeTotal;
      this.weightTotal = weightTotal;
      this.grossWeightTotal = grossWeightTotal;
      this.packageQuantityTotal = packageQuantityTotal;
    }
  }
}
