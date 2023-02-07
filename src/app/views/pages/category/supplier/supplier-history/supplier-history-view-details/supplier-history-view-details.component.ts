import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BaseFormComponent } from '../../../../../../core/_base/component/base-form.component';
import { SupplierHistoryService } from '../../../../../../services/modules/category/supplier-history/supplier-history.service';
import { DialogRef } from '../../../../../partials/content/crud/dialog/dialog-ref.model';
import * as configParent from '../../../supplier/supplier.config';

@Component({
  selector: 'app-supplier-history-view-details',
  templateUrl: './supplier-history-view-details.component.html',
  styleUrls: ['./supplier-history-view-details.component.scss']
})
export class SupplierHistoryViewDetailsComponent extends BaseFormComponent implements OnInit {
  public dialogRef: DialogRef = new DialogRef();

  public supplierData: any = {
    listSupplierBank: [],
    listSupplierGuaranteeCenter: [],
    listSupplierSales: []
  };

  public arrType = configParent.TYPE;
  public arrStatus = configParent.STATUS;
  public arrCommissionPolicy = configParent.COMMISSION_POLICY;
  public arrHeaderSales = configParent.HEADER_SALES;
  public arrHeaderBank = configParent.HEADER_BANK;
  public arrHeaderGuaranteeCenter = configParent.HEADER_GUARANTEE_CENTER;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    public supplierHistoryService: SupplierHistoryService
  ) {
    super();
  }

  ngOnInit() {
    this.arrHeaderBank = this.arrHeaderBank.filter((m, index) => index !== 5);
    this.arrHeaderGuaranteeCenter = this.arrHeaderGuaranteeCenter.filter((m, index) => index !== 4);
    this.arrHeaderSales = this.arrHeaderSales.filter((m, index) => index !== 6);
  }

  public onShowDialogClick(id: string): void {
    this.initData(id);
    this.dialogRef.show();
    this.cdr.detectChanges();
  }

  public initData(id: string): void {
    const categorySub = forkJoin([
      this.supplierHistoryService.selectById(id)
    ]).subscribe((res) => {
      this.supplierData = res[0];
      this.cdr.detectChanges();
    });
    this.subscriptions.push(categorySub);
  }

  public close() {
    this.dialogRef.hide();
  }

}
