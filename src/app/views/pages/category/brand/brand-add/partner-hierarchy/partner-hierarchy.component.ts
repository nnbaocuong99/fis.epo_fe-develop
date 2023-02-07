import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Guid } from 'guid-typescript';
import { forkJoin } from 'rxjs';
import { BaseFormComponent } from '../../../../../../core/_base/component';
import { CustomConfirmation } from '../../../../../../services/common/confirmation';
import { NotificationService } from '../../../../../../services/common/notification/notification.service';
import {
  BrandCoreSolutionsRequestPayload
} from '../../../../../../services/modules/category/brand-core-solutions/brand-core-solutions.request.payload';
import { BrandCoreSolutionsService } from '../../../../../../services/modules/category/brand-core-solutions/brand-core-solutions.service';
import { BrandHierarchyRequestPayload } from '../../../../../../services/modules/category/brand-hierarchy/brand-hierarchy.request.payload';
import { BrandHierarchyService } from '../../../../../../services/modules/category/brand-hierarchy/brand-hierarchy.service';
import { BrandService } from '../../../../../../services/modules/category/brand/brand.service';
import { SupplierService } from '../../../../../../services/modules/category/supplier/supplier.service';
import { FileService } from '../../../../../../services/modules/file/file.service';
import { UserRequestPayload } from '../../../../../../services/modules/user/user-request.payload';
import { UserService } from '../../../../../../services/modules/user/user.service';
import { ConfigListFactory } from '../../../../../partials/control/config-list/config-list-control.service';
import { DialogUploadFileComponent } from '../../../../../partials/control/upload-file/upload-file.component';
import * as config from './partner-hierarchy.config';

@Component({
  selector: 'app-partner-hierarchy',
  templateUrl: './partner-hierarchy.component.html',
  styleUrls: ['./partner-hierarchy.component.scss']
})
export class PartnerHierarchyComponent extends BaseFormComponent implements OnInit {
  @ViewChild('importFile', { static: false }) importFile: DialogUploadFileComponent;
  @ViewChild('form', { static: false }) form: NgForm;

  _brandData: any;
  get brandData(): any {
    return this._brandData;
  }
  @Input() set brandData(value: any) {
    this._brandData = value;
    if (this.brandData) {
      this.coreSolutionsData.items = this.brandData.listBrandCoreSolutionsHistory ? this.brandData.listBrandCoreSolutionsHistory : [];
      this.hierarchyData.items = this.brandData.listBrandHierarchyHistory ? this.brandData.listBrandHierarchyHistory : [];
    }
  }

  @Input() editTable = true;
  @Input() viewHistory = false;

  public userRequestPayLoad = new UserRequestPayload();
  public headerBrandCoreSolutions = config.HEADER_BRAND_CORE_SOLUTIONS;
  public headerBrandHierarchy = config.HEADER_BRAND_HIERARCHY;
  public coreSolutionsValidateFields = config.CORE_SOLUTIONS_VALIDATE_FIELD;
  public hierarchyValidateFields = config.HIERARCHY_VALIDATE_FIELD;
  public configListDataPamerRegion: any = {};
  public addCoreSolutionsItem: any = { id: Guid.create().toString().split('-').join('') };
  public addHierarchyItem: any = { id: Guid.create().toString().split('-').join('') };

  public currentBrandId: string;
  public headerUser = config.HEADER_USER;
  public userData = [];
  public coreSolutionsData = {
    items: null,
    paginatorTotal: undefined
  };
  public hierarchyData = {
    items: null,
    paginatorTotal: undefined
  };

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public supplierService: SupplierService,
    public brandService: BrandService,
    public brandCoreSolutionsService: BrandCoreSolutionsService,
    public brandHierarchyService: BrandHierarchyService,
    public notificationService: NotificationService,
    public userService: UserService,
    public fileService: FileService,
    public translateService: TranslateService,
    private cdr: ChangeDetectorRef,

  ) {
    super();
  }

  ngOnInit() {
    this.configData();
    this.configListDataPamerRegion = ConfigListFactory.instant('BRAND_PAMER_REGION');

    const routeSub = this.route.params.subscribe(params => {
      if (params.id) {
        this.currentBrandId = params.id;
        if (this.viewHistory === false) {
          this.loadData(this.currentBrandId);
        }
      } else {
        this.coreSolutionsData.items = [];
        this.hierarchyData.items = [
          { indexNo: 1, id: Guid.create().toString().split('-').join(''), pamerRegion: 'Hà Nội' },
          { indexNo: 2, id: Guid.create().toString().split('-').join(''), pamerRegion: 'Hồ Chí Minh' }
        ];
      }
    });
    this.subscriptions.push(routeSub);
  }

  public configData(): void {

    // Update header table
    const tempheaderBrandCoreSolutions = JSON.stringify(config.HEADER_BRAND_CORE_SOLUTIONS);
    const tempheaderBrandHierarchy = JSON.stringify(config.HEADER_BRAND_HIERARCHY);
    this.headerBrandCoreSolutions = JSON.parse(tempheaderBrandCoreSolutions);
    this.headerBrandHierarchy = JSON.parse(tempheaderBrandHierarchy);
    if (!this.editTable) {
      const indexBrandCoreSolutions = this.headerBrandCoreSolutions.findIndex(x => x.field === 'action');
      const indexBrandHierarchy = this.headerBrandHierarchy.findIndex(x => x.field === 'action');
      if (indexBrandCoreSolutions > -1) {
        this.headerBrandCoreSolutions.splice(indexBrandCoreSolutions, 1);
      }
      if (indexBrandHierarchy > -1) {
        this.headerBrandHierarchy.splice(indexBrandHierarchy, 1);
      }
    }
    // Get user theo role
    const requestUser = new UserRequestPayload();
    requestUser.roleName = 'BP_MANAGER;BP_STAFF';
    this.userService.select(requestUser).subscribe(res => {
      // Fix search control
      this.userData = res.map(x => {
        x.search_label = ` ${x.fullName} ${x.userName}`;
        return x;
      });
    });
  }

  public loadData(currentBrandId: string): void {
    const requestBrandCoreSolutions = new BrandCoreSolutionsRequestPayload();
    const requestBrandHierarchy = new BrandHierarchyRequestPayload();
    requestBrandCoreSolutions.brandId = currentBrandId;
    requestBrandHierarchy.brandId = currentBrandId;

    const initSub = forkJoin([
      this.brandHierarchyService.select(requestBrandHierarchy),
      this.brandCoreSolutionsService.select(requestBrandCoreSolutions)
    ]).subscribe(res => {
      if (res[0] && res[0].length > 0) {
        this.hierarchyData.items = res[0];

        if (this.editTable) {
          for (const item of this.hierarchyData.items) {
            item.pamerDto = [];
            const arr = item.pamer ? item.pamer.split(',') : null;
            for (const obj of arr) {
              for (const user of this.userData) {
                if (user.userName === obj) {
                  item.pamerDto.push(user);
                }
              }
            }
          }
        }
      } else {
        this.hierarchyData.items = [];
      }
      if (res[1] && res[1].length > 0) {
        this.coreSolutionsData.items = res[1];
      } else {
        this.coreSolutionsData.items = [];
      }

      this.cdr.detectChanges();

    });
    this.subscriptions.push(initSub);
  }

  public checkValidateFormPartnerHierarchy(): boolean {
    if (this.form) {
      if (!this.validateForm(this.form, 'id-form-partner')) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  public onRowEditInit(): void {
    this.form.form.markAsDirty();
  }

  public onBtnCancelClick(): void {
    this.router.navigate([`brand`], { relativeTo: this.route.parent });
  }

  public addNewRow(validateFields: any, sourceData: any, type: number): void {
    const addItem = (type === 1) ? this.addCoreSolutionsItem : this.addHierarchyItem;
    if (this.validateNewRow(validateFields, type)) {
      this.onRowEditInit();
      if (addItem) {
        addItem.isAddRow = true;
        if (this.currentBrandId) {
          addItem.brandId = this.currentBrandId;
        }
        if (sourceData.items && sourceData.items.length > 0) {
          sourceData.items = sourceData.items.concat(addItem);

        } else {
          sourceData.items = [];
          sourceData.items.push(addItem);
        }
      }

      if (type === 1) {
        this.addCoreSolutionsItem = { id: Guid.create().toString().split('-').join('') };
      } else {
        this.addHierarchyItem = { id: Guid.create().toString().split('-').join('') };
        this.addHierarchyItem.pamerDto = [];
        this.userData = this.userData.filter(x => x.id);
      }
      this.cdr.detectChanges();
    }
  }

  public validateNewRow(validateFields: any, type: number): boolean {
    const addItem = (type === 1) ? this.addCoreSolutionsItem : this.addHierarchyItem;
    let result = true;
    for (const item of validateFields) {
      if (item.validateValue.some(x => x === addItem[item.field])) {
        this.notificationService.showMessage(item.message);
        result = false;
        break;
      }
    }
    return result;
  }

  public onBtnDeleteClick(listSource: any, rowData: any): void {
    const index = listSource.items.findIndex(x => (x.isAddRow && x.isAddRow === true) || (rowData.id && x.id === rowData.id));
    if (index > -1) {
      listSource.items.splice(index, 1);
      this.onRowEditInit();
    }
  }

  public checkLicensedImport(): void {
    this.importFile.open();
  }

  public onBtnUploadClick(): void {
    const confirm = new CustomConfirmation('BRAND.WARNING_IMPORT_ITEM');
    const request = new BrandHierarchyRequestPayload();
    if (this.currentBrandId) {
      request.brandId = this.currentBrandId;
    }
    confirm.accept = () => {
      const files = this.importFile.tableFile.map((x) => x.file);
      this.brandHierarchyService
        .import(files, request)
        .subscribe(
          (res) => {
            this.importFile.close();
            this.brandData.priority = res.priority;
            this.brandData.fisPartnerId = res.fisPartnerId;
            this.brandData.dealRegistration = res.dealRegistration;
            this.brandData.caseStudies = res.caseStudies;
            this.coreSolutionsData.items = res.brandCoreSolutionsList;
            this.hierarchyData.items = res.brandHierarchyList;
            if (this.currentBrandId) {
              this.coreSolutionsData.items.forEach(element => {
                element.brandId = this.currentBrandId;
              });
              this.hierarchyData.items.forEach(element => {
                element.brandId = this.currentBrandId;
              });
            }

            this.form.form.markAsDirty();
            this.cdr.detectChanges();
          },
          (err: HttpErrorResponse) => {
            this.notificationService.showError(err.error.toString().substring('Error on line'.length));
          }
        );
    };
    this.notificationService.confirm(confirm);
  }

  public addTagFn(name: string) {
    return name;
  }

  public onChangePamer(event: any, rowData: any): void {
    if (event) {
      const arr = [];
      for (const item of rowData.pamerDto) {
        arr.push(item.userName);
      }
      rowData.pamer = arr.join(',');
    }
  }

}
