import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BaseFormComponent } from '../../../../../../core/_base/component';
import { BrandHistoryService } from '../../../../../../services/modules/category/brand-history/brand-history.service';
import { DialogRef } from '../../../../../partials/content/crud/dialog/dialog-ref.model';
import * as mainConfig from '../../../../../../core/_config/main.config';
@Component({
  selector: 'app-brand-history-view-details',
  templateUrl: './brand-history-view-details.component.html',
  styleUrls: ['./brand-history-view-details.component.scss']
})
export class BrandHistoryViewDetailsComponent extends BaseFormComponent implements OnInit {
  public dialogRef: DialogRef = new DialogRef();

  public brandData: any = {
    listBrandContactInfo: [],
    listBrandCoreSolutions: [],
    listBrandHierarchy: []
  };
  public mainConfig = mainConfig.MAIN_CONFIG;

  constructor(
    private cdr: ChangeDetectorRef,
    public brandHistoryService: BrandHistoryService
  ) {
    super();
  }

  ngOnInit() {

  }

  public onShowDialogClick(id: string): void {
    this.initData(id);
    this.dialogRef.show();
    this.cdr.detectChanges();
  }

  public initData(id: string): void {
    const categorySub = forkJoin([
      this.brandHistoryService.selectById(id)
    ]).subscribe((res) => {
      this.brandData = res[0];
      this.cdr.detectChanges();
    });
    this.subscriptions.push(categorySub);
  }

  public close() {
    this.dialogRef.hide();
  }

}
