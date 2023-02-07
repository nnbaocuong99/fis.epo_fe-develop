import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BaseFormComponent } from '../../../../../core/_base/component';
import { NotificationService } from '../../../../../services/common/notification/notification.service';
import { PurchaseInvoiceItemService } from '../../../../../services/modules/purchase-invoice-item/purchase-invoice-item.service';
import { DialogRef } from '../../../../partials/content/crud/dialog/dialog-ref.model';

@Component({
  selector: 'app-dialog-request-update-org',
  templateUrl: './dialog-request-update-org.component.html',
  styleUrls: ['./dialog-request-update-org.component.scss']
})
export class DialogRequestUpdateOrgComponent extends BaseFormComponent implements OnInit {
  @ViewChild('form', { static: true }) form: NgForm;
  @Input() dialogRef = new DialogRef();

  public request: any = {};
  public listPo = [];

  constructor(
    public purchaseInvoiceItemService: PurchaseInvoiceItemService,
    public notificationService: NotificationService) {
    super();
  }

  ngOnInit() {
    this.dialogRef.visibility$.subscribe(res => {
      if (res) {
        setTimeout(() => {
          this.form.form.reset();
          const itemsGrouped = this.groupBy(this.dialogRef.input.items.map(x => x.data), 'poId');
          this.listPo = Object.keys(itemsGrouped).map(x => {
            const result: any = {};
            result.id = x;
            result.code = itemsGrouped[x][0].code;
            return result;
          });
        }, 0);
      }
    });
  }

  public onBtnSaveChangeClick(formId: string): void {
    if (this.validateForm(this.form, formId)) {
      const body = {
        piId: this.dialogRef.input.piId,
        poIds: this.listPo.map(x => x.id),
        note: this.request.note
      };

      this.purchaseInvoiceItemService.requestUpdateOrgCode(body).subscribe(res => {
        if (res) {
          this.dialogRef.hide();
          this.notificationService.showMessage('Request sent');
        }
      });
    }
  }

  private groupBy(xs: any, key: string) {
    return xs.reduce((rv: any, x: any) => {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

  public onHide(): void {
    this.request = {};
  }
}
