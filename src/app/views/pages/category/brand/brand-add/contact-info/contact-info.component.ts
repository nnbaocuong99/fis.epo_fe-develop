import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { forkJoin } from 'rxjs';
import { BaseFormComponent } from '../../../../../../core/_base/component';
import { CustomConfirmation, DeleteConfirmation } from '../../../../../../services/common/confirmation';
import { NotificationService } from '../../../../../../services/common/notification/notification.service';
import {
  BrandContactInfoRequestPayload
} from '../../../../../../services/modules/category/brand-contact-info/brand-contact-info.request.payload';
import { BrandContactInfoService } from '../../../../../../services/modules/category/brand-contact-info/brand-contact-info.service';
import {
  BrandWarrantyContactPersonsService
} from '../../../../../../services/modules/category/brand-warranty-contact-persons/brand-warranty-contact-persons.service';
import { DialogUploadFileComponent } from '../../../../../partials/control/upload-file/upload-file.component';
import * as configAdd from '../brand-add.config';

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss']
})
export class ContactInfoComponent extends BaseFormComponent implements OnInit {
  @ViewChild('importFile', { static: false }) importFile: DialogUploadFileComponent;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('formContact', { static: false }) formContact: NgForm;

  @Input() editTable = true;
  @Input() viewHistory = false;
  @Output() editRow: EventEmitter<any> = new EventEmitter();

  _brandData: any;
  get brandData(): any {
    return this._brandData;
  }
  @Input() set brandData(value: any) {
    this._brandData = value;
    if (this.brandData) {
      // tslint:disable-next-line:max-line-length
      this.dataSourceContactPersons.items = this.brandData.listBrandWarrantyContactPersonsHistory ? this.brandData.listBrandWarrantyContactPersonsHistory : [];
      this.dataSourceContactInfo.items = this.brandData.listBrandContactInfoHistory ? this.brandData.listBrandContactInfoHistory : [];
    }
  }


  public headBrandWarrantyContactPersons: any;
  public headersContact: any;
  public gender = configAdd.GENDER;
  public validateFields = configAdd.VALIDATE_FIELD;

  btnItems: MenuItem[] = [
    { label: 'Xóa', icon: 'pi pi-fw pi-times', command: () => this.onBtnDeleteClick(this.dataSourceContactInfo, this.selectedRowData) }
  ];

  public dataSourceContactPersons = {
    items: null,
    paginatorTotal: undefined
  };

  public dataSourceContactInfo = {
    items: null,
    paginatorTotal: undefined
  };

  public selectedRowData: any;
  public addItemContactPersons: any = {};
  public addItemContactInfo: any = {};
  public currentBrandId: string;

  constructor(
    public notificationService: NotificationService,
    public brandWarrantyContactPersonsService: BrandWarrantyContactPersonsService,
    public brandContactInfoService: BrandContactInfoService,
    private cdr: ChangeDetectorRef,
    public route: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit() {
    const tempContactPersons = JSON.stringify(configAdd.HEADER_BRAND_WARRANTY_CONTACT_PERSONS);
    this.headBrandWarrantyContactPersons = JSON.parse(tempContactPersons);
    const tempContactInfo = JSON.stringify(configAdd.HEADER_CONTACT);
    this.headersContact = JSON.parse(tempContactInfo);
    if (!this.editTable) {
      const indexContactPersons = this.headBrandWarrantyContactPersons.findIndex(x => x.field === 'action');
      if (indexContactPersons > -1) {
        this.headBrandWarrantyContactPersons.splice(indexContactPersons, 1);
      }
      const indexContactInfo = this.headersContact.findIndex(x => x.field === 'action');
      if (indexContactInfo > -1) {
        this.headersContact.splice(indexContactInfo, 1);
      }
    }

    const routeSub = this.route.params.subscribe(params => {
      if (params.id) {
        this.currentBrandId = params.id;
        if (this.viewHistory === false) {
          this.loadContactInfoData(this.currentBrandId);
        }
      } else {
        this.dataSourceContactPersons.items = [];
        this.dataSourceContactInfo.items = [];
      }
    });
    this.subscriptions.push(routeSub);
  }

  public loadContactInfoData(brandId: string): void {
    const request = new BrandContactInfoRequestPayload();
    request.brandId = brandId;
    const initSub = forkJoin([
      this.brandWarrantyContactPersonsService.select(request),
      this.brandContactInfoService.select(request)
    ]).subscribe(res => {
      if (res[0]) {
        this.dataSourceContactPersons.items = res[0];
        this.dataSourceContactPersons.paginatorTotal = res[0].length;
      } else {
        this.dataSourceContactPersons.items = [];
      }
      if (res[1]) {
        this.dataSourceContactInfo.items = res[1];
        this.dataSourceContactInfo.paginatorTotal = res[1].length;
      } else {
        this.dataSourceContactInfo.items = [];
      }

      this.cdr.detectChanges();

    });
    this.subscriptions.push(initSub);
  }

  public onRowEditInit(): void {
    this.editRow.emit();
  }

  public addNewRow(addItem: any, dataSource: any, type: number): void {
    if (this.validateNewRow(addItem, type)) {
      this.editRow.emit();
      if (addItem) {
        addItem.isAddRow = true;
        if (addItem.gender) {
          addItem.gender = +addItem.gender;
        }
        if (dataSource.items && dataSource.items.length > 0) {
          dataSource.items = dataSource.items.concat(addItem);

        } else {
          dataSource.items = [];
          dataSource.items.push(addItem);
        }
      }
      this.cdr.detectChanges();
      if (type === 1) {
        this.addItemContactPersons = {};
      } else {
        this.addItemContactInfo = {};
      }
    }

    this.editRow.emit();
  }

  public validateNewRow(addItem: any, type: number): boolean {
    let result = true;
    if (type === 1) {
      // default không có field isRequired
    } else {
      for (const item of this.validateFields) {
        if (item.validateValue.some(x => x === addItem[item.field])) {
          this.notificationService.showMessage(item.message);
          result = false;
          break;
        }
      }
    }

    return result;
  }

  public onBtnDeleteClick(dataSource, rowData: any): void {
    const index = dataSource.items.findIndex(x => (x.isAddRow && x.isAddRow === true) || (rowData.id && x.id === rowData.id));
    if (index > -1) {
      dataSource.items.splice(index, 1);
      this.editRow.emit();
    }

    // if (this.currentBrandId && !rowData.isAddRow && rowData.id) {
    //   this.processDelete(rowData.id);
    // }
  }

  // public processDelete(id: string) {
  //   this.brandContactInfoService.delete(id).subscribe(() => {
  //     this.notificationService.showDeteleSuccess();
  //   });
  // }

  public onShowContextMenu() {
    // todo
  }

  public checkLicensedImport(): void {
    this.importFile.open();
  }

  public onBtnUploadClick(): void {
    const confirm = new CustomConfirmation('BRAND.WARNING_IMPORT_ITEM_LIST');
    const request = new BrandContactInfoRequestPayload();
    if (this.currentBrandId) {
      request.brandId = this.currentBrandId;
    }
    confirm.accept = () => {
      const files = this.importFile.tableFile.map((x) => x.file);
      this.brandContactInfoService
        .import(files, request)
        .subscribe(
          (res) => {
            this.importFile.close();
            if (this.currentBrandId) {
              this.loadContactInfoData(this.currentBrandId);
              this.notificationService.showSuccess();
            } else {
              res.forEach(element => {
                this.dataSourceContactInfo.items.push(element);
              });
              this.editRow.emit();
            }
            this.cdr.detectChanges();
          },
          (err: HttpErrorResponse) => {
            this.notificationService.showError(err.error.toString().substring('Error on line'.length));
          }
        );
    };
    this.notificationService.confirm(confirm);
  }

}
