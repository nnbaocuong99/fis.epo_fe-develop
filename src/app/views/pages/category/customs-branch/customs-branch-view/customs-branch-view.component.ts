import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import * as configParent from '../../customs-branch/customs-branch.config';
import * as mainConfig from '../../../../../core/_config/main.config';
import { Guid } from 'guid-typescript';
import { NgForm } from '@angular/forms';
import { BaseFormComponent } from '../../../../../core/_base/component/base-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../../../services/common/notification/notification.service';
import { CustomsBranchService } from '../../../../../services/modules/category/customs-branch/customs-branch.service';
import { CustomsFeesService } from '../../../../../services/modules/category/customs-fees/customs-fees.service';
import { CustomsFeesRequestPayload } from '../../../../../services/modules/category/customs-fees/customs-fees.request.payload';
import { forkJoin } from 'rxjs';
import { CustomsTypeService } from '../../../../../services/modules/category/customs-type/customs-type.service';
import { CustomsTypeRequestPayload } from '../../../../../services/modules/category/customs-type/customs-type.request.payload';
import { Location } from '@angular/common';
@Component({
  selector: 'app-customs-branch-view',
  templateUrl: './customs-branch-view.component.html',
  styleUrls: ['./customs-branch-view.component.scss']
})
export class CustomsBranchViewComponent extends BaseFormComponent implements OnInit {

  public mainConfig = mainConfig.MAIN_CONFIG;

  public customsBranchData: any = {
    listCustomsFees: [],
    listCustomsType: []
  };

  public arrHeaderCustomsFees = configParent.HEADER_CUSTOMS_FEES;
  public arrHeaderCustomsType = configParent.HEADER_CUSTOMS_TYPE;

  constructor(
    public cdr: ChangeDetectorRef,
    public router: Router,
    public route: ActivatedRoute,
    public notification: NotificationService,
    public customsBranchService: CustomsBranchService,
    public customsFeesService: CustomsFeesService,
    public customsTypeService: CustomsTypeService
  ) {
    super();
  }

  ngOnInit() {
    this.arrHeaderCustomsFees = this.arrHeaderCustomsFees.filter((m, index) => index !== 6);
    this.arrHeaderCustomsType = this.arrHeaderCustomsType.filter((m, index) => index !== 3);

    const routeSub = this.route.params.subscribe(params => {
      if (params.id) {

        const requestCustomsFees: any = new CustomsFeesRequestPayload();
        requestCustomsFees.customsBranchId = params.id;

        const requestCustomsType: any = new CustomsTypeRequestPayload();
        requestCustomsType.customsBranchId = params.id;

        const initSub = forkJoin([
          this.customsBranchService.selectById(params.id),
          this.customsFeesService.select(requestCustomsFees),
          this.customsTypeService.select(requestCustomsType)
        ]).subscribe(res => {
          if (res[0]) {
            this.customsBranchData = res[0];
            this.customsBranchData.listCustomsFees = res[1];
            this.customsBranchData.listCustomsType = res[2];
          } else {
            this.goBack();
          }
          this.cdr.detectChanges();
        });
        this.subscriptions.push(initSub);
      }
    });
    this.subscriptions.push(routeSub);
  }

  public goBack(): void {
    this.router.navigate([`customs-branch`], { relativeTo: this.route.parent });
  }

  public goToEdit(): void {
    this.router.navigate([`customs-branch/edit/${this.customsBranchData.id}`], { relativeTo: this.route.parent });
  }

}
