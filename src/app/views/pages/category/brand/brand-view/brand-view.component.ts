import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BaseFormComponent } from '../../../../../core/_base/component';
import { BrandService } from '../../../../../services/modules/category/brand/brand.service';
import { FileRequestPayload } from '../../../../../services/modules/file/file.request.payload';
import { FileService } from '../../../../../services/modules/file/file.service';
import { FileDownload } from '../../../../partials/control/download-file/download-file.component';
import { BrandHistoryComponent } from '../brand-history/brand-history.component';
import * as config from './brand-view.config';
import * as mainConfig from '../../../../../core/_config/main.config';
import { Location } from '@angular/common';
@Component({
  selector: 'app-brand-view',
  templateUrl: './brand-view.component.html',
  styleUrls: ['./brand-view.component.scss']
})
export class BrandViewComponent extends BaseFormComponent implements OnInit {
  @ViewChild('brandHistory', { static: false }) brandHistory: BrandHistoryComponent;

  public brandData: any = {};
  public currentBrandId: string;
  public brandFile: any;
  public headerView = config.VIEW_COMMON_INFO;
  public mainConfig = mainConfig.MAIN_CONFIG;
  public brandType = config.TYPE_BRAND;

  constructor(
    public brandService: BrandService,
    public cdr: ChangeDetectorRef,
    public fileService: FileService,
    public router: Router,
    public route: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit() {
    const routeSub = this.route.params.subscribe(params => {
      if (params.id) {
        this.currentBrandId = params.id;
        this.initData();
      }
    });
    this.subscriptions.push(routeSub);
  }

  public initData(): void {
    const requestBrandFile = new FileRequestPayload();
    requestBrandFile.module = 'Attachment\\Brand\\' + this.currentBrandId;
    const initSub = forkJoin([
      this.brandService.selectById(this.currentBrandId),
      this.fileService.select(requestBrandFile)
    ]).subscribe(res => {
      if (res[0]) {
        this.brandData = res[0];
      } else {
        this.goBack();
      }

      if (res[1] && res[1].length > 0) {
        this.brandFile = res[1][0];
      }
      this.cdr.detectChanges();
    });
    this.subscriptions.push(initSub);
  }

  public onBtnDownloadClick(): void {
    if (this.brandFile && this.brandFile.id) {
      const fileDownload = new FileDownload();
      fileDownload.id = this.brandFile.id;
      fileDownload.name = this.brandFile.name;
      this.fileService.download(fileDownload);
    }
  }

  public goBack(): void {
    this.router.navigate([`brand`], { relativeTo: this.route.parent });
  }

  public goToEdit(): void {
    this.router.navigate([`brand/edit/${this.brandData.id}`], { relativeTo: this.route.parent });
  }

  public viewHistory(): void {
    this.brandHistory.onBtnShowDialogListClick();
    this.cdr.detectChanges();
  }

}
