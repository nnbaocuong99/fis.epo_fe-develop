import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { forkJoin } from 'rxjs';
import { BaseFormComponent } from '../../../../../../core/_base/component';
import { NotificationService } from '../../../../../../services/common/notification/notification.service';
import {
  BrandMembershipRequirementRequestPayload
} from '../../../../../../services/modules/category/brand-membership-requirement/brand-membership-requirement.request.payload';
import {
  BrandMembershipRequirementService
} from '../../../../../../services/modules/category/brand-membership-requirement/brand-membership-requirement.service';
import * as config from './brand-membership-requirement.config';

@Component({
  selector: 'app-brand-membership-requirement',
  templateUrl: './brand-membership-requirement.component.html',
  styleUrls: ['./brand-membership-requirement.component.scss']
})
export class BrandMembershipRequirementComponent extends BaseFormComponent implements OnInit {
  @ViewChild('form', { static: false }) form: NgForm;

  @Input() editTable = true;

  @Output() hasEdit: EventEmitter<any> = new EventEmitter();

  public addItem: any = { id: Guid.create().toString().split('-').join('') };
  public currentBrandId: string;
  public header: any;
  public validateFields = config.BRAND_MEMBERSHIP_REQUIREMENT_VALIDATE_FIELD;
  public dataSource = {
    items: null,
    paginatorTotal: undefined
  };

  constructor(
    public brandMembershipRequirement: BrandMembershipRequirementService,
    public notificationService: NotificationService,
    private cdr: ChangeDetectorRef,
    public router: Router,
    public route: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit() {
    const tempheader = JSON.stringify(config.HEADER_BRAND_MEMBERSHIP_REQUIREMENT);
    this.header = JSON.parse(tempheader);
    if (!this.editTable) {
      const index = this.header.findIndex(x => x.field === 'action');
      if (index > -1) {
        this.header.splice(index, 1);
      }
    }

    const routeSub = this.route.params.subscribe(params => {
      if (params.id) {
        this.currentBrandId = params.id;
        this.loadData(this.currentBrandId);
      } else {
        this.dataSource.items = [
          { indexNo: 1, id: Guid.create().toString().split('-').join(''), requirement: 'Certification', information: 'Chứng chỉ yêu cầu' },
          { indexNo: 2, id: Guid.create().toString().split('-').join(''), requirement: 'Revenue', information: 'Doanh số' },
          { indexNo: 3, id: Guid.create().toString().split('-').join(''), requirement: 'Fee', information: 'Phí' },
          // tslint:disable-next-line:max-line-length
          { indexNo: 4, id: Guid.create().toString().split('-').join(''), requirement: 'Capacity Audit', information: 'Kiểm tra năng lực hàng năm' },
        ];
      }
    });
    this.subscriptions.push(routeSub);
  }

  public loadData(currentBrandId: string): void {
    const request = new BrandMembershipRequirementRequestPayload();
    request.brandId = currentBrandId;

    const initSub = forkJoin([
      this.brandMembershipRequirement.select(request),
      this.brandMembershipRequirement.count(request)
    ]).subscribe(res => {
      this.dataSource.items = res[0].sort((a, b) => parseFloat(a.indexNo) - parseFloat(b.indexNo));
      this.dataSource.paginatorTotal = res[1];
      this.cdr.detectChanges();

    });
    this.subscriptions.push(initSub);
  }

  public addNewRow(): void {
    const addItem = this.addItem;
    if (this.validateNewRow(this.validateFields)) {
      this.onRowEditInit();
      if (addItem) {
        if (this.currentBrandId) {
          addItem.brandId = this.currentBrandId;
        }

        if (this.dataSource.items && this.dataSource.items.length > 0) {
          addItem.indexNo = this.dataSource.items.length + 1;
          this.dataSource.items = this.dataSource.items.concat(addItem);
        } else {
          this.dataSource.items = [];
          addItem.indexNo = 1;
          this.dataSource.items.push(addItem);
        }
      }
      this.addItem = { id: Guid.create().toString().split('-').join('') };
      this.cdr.detectChanges();
    }
  }

  public validateNewRow(validateFields: any): boolean {
    let result = true;
    for (const item of validateFields) {
      if (item.validateValue.some(x => x === this.addItem[item.field])) {
        this.notificationService.showMessage(item.message);
        result = false;
        break;
      }
    }
    return result;
  }

  public onBtnDeleteClick(rowData: any): void {
    const index = this.dataSource.items.findIndex(x => x.id === rowData.id);
    if (index > -1) {
      this.dataSource.items.splice(index, 1);
      this.onRowEditInit();
    }
  }

  public onRowEditInit(): void {
    this.hasEdit.emit();
    // this.form.form.markAsDirty();
  }

  public onChangeIsRequired(rowData: any, event: any) {
    this.onRowEditInit();
    rowData.isRequired = event.checked ? 1 : 0;
  }

}
