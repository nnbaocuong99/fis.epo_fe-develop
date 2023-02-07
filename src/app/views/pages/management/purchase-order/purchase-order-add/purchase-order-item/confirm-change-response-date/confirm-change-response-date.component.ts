import { Component, Input, OnInit } from '@angular/core';
import { PurchaseOrderItemService } from '../../../../../../../services/modules/purchase-order-item/purchase-order-item.service';
import { DialogRef } from '../../../../../../partials/content/crud/dialog/dialog-ref.model';

@Component({
  selector: 'app-confirm-change-response-date',
  templateUrl: './confirm-change-response-date.component.html',
  styleUrls: ['./confirm-change-response-date.component.scss']
})
export class ConfirmChangeResponseDateComponent implements OnInit {
  @Input() dialogRef = new DialogRef();
  public confirmData: any = {};

  constructor(
    public purchaseOrderItemService: PurchaseOrderItemService
  ) { }

  ngOnInit() {
  }

  public onBtnSaveChangeClick(): void {
    const body = { ...this.dialogRef.input };
    body.note = this.confirmData.note;
    this.purchaseOrderItemService.updateResponseDate(body).subscribe((res) => {
      this.dialogRef.input.responseDateOriginal = res.responseDate;
      Object.assign(this.dialogRef.input, res);
    });

    this.dialogRef.output.isSave = true;
    this.dialogRef.hide();
  }

  public onBtnCancelClick(): void {
    if (!this.dialogRef.output.isSave) {
      this.dialogRef.input.responseDate = this.dialogRef.input.responseDateOriginal;
      this.dialogRef.output.isSave = undefined;
      this.confirmData.note = undefined;
    }
  }
}
