import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { BaseComponent } from '../../../../../../core/_base/component/base-component';
import { PurchasePlanHistoryService } from '../../../../../../services/modules/purchase-plan-history/purchase-plan-history.service';
import {
  PurchasePlanItemHistoryService
} from '../../../../../../services/modules/purchase-plan-item-history/purchase-plan-item-history.service';
import { DialogRef } from '../../../../../partials/content/crud/dialog/dialog-ref.model';
import * as mainConfig from '../../../../../../core/_config/main.config';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../../../core/reducers';
import { currentUser } from '../../../../../../core/auth';
@Component({
  selector: 'app-purchase-plan-view-details',
  templateUrl: './purchase-plan-view-details.component.html',
  styleUrls: ['./purchase-plan-view-details.component.scss']
})
export class PurchasePlanViewDetailsComponent extends BaseComponent implements OnInit {
  public dialogRef: DialogRef = new DialogRef();

  public purchasePlanHistory: any;
  public mainConfig = mainConfig.MAIN_CONFIG;
  public allowViewPrice = false; // check có cả AM và PM thì PM không được xem giá

  constructor(
    private cdr: ChangeDetectorRef,
    public purchasePlanHistoryService: PurchasePlanHistoryService,
    public purchasePlanItemHistoryService: PurchasePlanItemHistoryService,
    private store: Store<AppState>
  ) {
    super();
  }

  ngOnInit() {

  }

  public checkRole() {
    this.store.pipe(select(currentUser)).subscribe(obj => {
      if (obj) {
        const userName = obj.userName ? obj.userName.trim().toLocaleLowerCase() : '';
        const amAccount = this.purchasePlanHistory.amAccount ? this.purchasePlanHistory.amAccount.trim().toLocaleLowerCase() : '';
        const pmAccount = this.purchasePlanHistory.pmAccount ? this.purchasePlanHistory.pmAccount.trim().toLocaleLowerCase() : '';
        if (`,${pmAccount},`.includes(`,${userName},`)) {
          this.allowViewPrice = false;
        }
        if (`,${amAccount},`.includes(`,${userName},`)) {
          this.allowViewPrice = true;
        }
        if (obj.roles && obj.roles.length > 0) {
          if (obj.roles.some(m => m.includes('BP_') || m.includes('XNK_') || m.includes('AF_') || m === 'SUPER_ADMIN')) {
            this.allowViewPrice = true;
          }
        }
      }
    });
  }

  public onShowDialogClick(id: string): void {
    this.initData(id);
    this.dialogRef.show();
    this.cdr.detectChanges();
  }

  public initData(id: string): void {
    const categorySub = forkJoin([
      this.purchasePlanHistoryService.selectById(id)
    ]).subscribe((res) => {
      this.purchasePlanHistory = res[0];
      this.checkRole();
      this.cdr.detectChanges();
    });
    this.subscriptions.push(categorySub);
  }

  public close() {
    this.dialogRef.hide();
  }

}
