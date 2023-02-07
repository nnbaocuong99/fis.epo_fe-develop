import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import * as config from './brand.config';
import * as mainConfig from '../../../../core/_config/main.config';
import { BaseListComponent } from '../../../../core/_base/component/base-list.component';
import { SupplierRequestPayload } from '../../../../services/modules/category/supplier/supplier.request.payload';
import { ToolbarModel } from '../../../partials/content/toolbar/toolbar.model';
import { DeleteConfirmation } from '../../../../services/common/confirmation/delete-confirmation';
import { NotificationService } from '../../../../services/common/notification/notification.service';
import { BrandRequestPayload } from '../../../../services/modules/category/brand/brand.request.payload';
import { BrandService } from '../../../../services/modules/category/brand/brand.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { UserService } from '../../../../services/modules/user/user.service';
import * as configAdd from './brand-add/brand-add.config';
import { CurrencyService } from '../../../../services/modules/category/currency/currency.service';
import { DialogUploadFileComponent } from '../../../partials/control/upload-file/upload-file.component';
import { CustomConfirmation } from '../../../../services/common/confirmation';
import { DownloadFileTemplateComponent } from '../../../partials/control/download-file/download-file.component';
import { BrandViewYearComponent } from './brand-view-year/brand-view-year.component';
import { DialogRef } from '../../../partials/content/crud/dialog/dialog-ref.model';
@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss']
})
export class BrandComponent extends BaseListComponent implements OnInit {
  @ViewChild(DialogUploadFileComponent, { static: false }) private importFile: DialogUploadFileComponent;
  @ViewChild('downloadFileTemplateComponent', { static: false }) downloadFileTemplateComponent: DownloadFileTemplateComponent;
  @ViewChild('brandViewYear', { static: false }) brandViewYear: BrandViewYearComponent;

  public toolbarModel: ToolbarModel;
  btnItems: MenuItem[] = [
    { label: 'Xem', icon: 'pi pi-fw pi-search', command: () => this.onBtnViewClick(this.selectedRowData.id) },
    { label: 'Sửa', icon: 'pi pi-fw pi-pencil', command: () => this.onBtnEditClick(this.selectedRowData.id) },
    { label: 'Xóa', icon: 'pi pi-fw pi-times', command: () => this.onBtnDeleteClick(this.selectedRowData.id) }
  ];
  selectedRowData: any;
  public brandType = configAdd.TYPE_BRAND;
  public exportDialogRef = new DialogRef();
  public cloneDataDialogRef = new DialogRef();
  public exportRequest = new BrandRequestPayload();
  public cloneRequest = new BrandRequestPayload();
  public brandListAllData = [];
  public brandListYear = [];

  constructor(
    public brandService: BrandService,
    public notification: NotificationService,
    public userService: UserService,
    public currencyService: CurrencyService,
    private cdr: ChangeDetectorRef,
    public router: Router,
    public route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit() {
    this.pageSizeDefault = 10;
    this.baseService = this.brandService;
    this.headers = config.HEADER;
    this.mainConfig = mainConfig.MAIN_CONFIG;
    this.request = new BrandRequestPayload();
    const requestAll = new BrandRequestPayload();
    this.brandService.selectBrandYear(requestAll).subscribe(res => {
      const dataTemp = Object.keys(this.groupBy(res, 'brandYear'));
      const arr = [];
      for (const item of dataTemp) {
        if (item !== 'undefined') {
          arr.push({ label: item });
        }
      }
      this.brandListYear = arr;
      this.brandListAllData = res;
      this.cdr.detectChanges();
    });

    super.ngOnInit();
    this.fnSuccess = () => {
      this.configToolbar();
    };
  }

  public setFragmentToRoute(event: any): void {
    this.router.navigate([], {
      queryParams: {
        createdSource: event.nextId
      }
    });
  }

  private configToolbar(): void {
    this.toolbarModel = new ToolbarModel();
    this.toolbarModel.add.routerLink = [`add`];

    this.toolbarModel.option.export.click = () => this.exportFileDataClick();
    this.toolbarModel.option.import.click = () => this.importFileDataClick();
    this.toolbarModel.option.customize.title = 'Download Template';
    this.toolbarModel.option.customize.icons = 'kt-nav__link-icon fal fa-cloud-download';
    this.toolbarModel.option.customize.click = () => this.downloadTemplateFile();
    this.toolbarModel.option.clone.show = true;
    // Năm mới không có hãng sản xuất mới clone
    if (this.dataSource.items && this.dataSource.items.length === 0) {
      this.toolbarModel.option.clone.disabled = false;
    } else {
      this.toolbarModel.option.clone.disabled = true;
      this.cloneDataDialogRef.input.disabled = true;
    }
    this.toolbarModel.option.clone.title = 'Clone hãng sản xuất';
    this.toolbarModel.option.clone.click = () => this.cloneDataBrandClick();
    this.toolbarModel.option.add.show = false;
    this.toolbarModel.option.save.show = false;
    this.toolbarModel.option.update.show = false;
  }

  public exportFileDataClick(): void {
    // Show dialog
    this.exportDialogRef.isDisplay = true;
  }

  public exportBrandInfo(): void {
    this.brandService.exportAll(this.exportRequest).subscribe(() => {
      this.notification.showMessage('Export complete');
    });
  }

  public cloneDataBrandClick(): void {
    // Show dialog
    if (!this.cloneDataDialogRef.input.disabled) {
      this.cloneDataDialogRef.isDisplay = true;
    }
  }

  public btnCloneBrandData(): void {
    if (!this.cloneRequest.brandYear) {
      this.notification.showWarning('Vui lòng chọn hãng năm sản xuất để thực hiện clone');
      return;
    }
    const confirm = new CustomConfirmation('Bạn có chắc chắn muốn thực hiện clone ??');
    confirm.accept = () => {
      this.brandService.cloneData(this.cloneRequest).subscribe(res => {
        if (res) {
          this.notification.showMessage('Clone complete');
        }
      });
    };
    this.notification.confirm(confirm);
  }

  public exportBrandMarketingFund(): void {
    this.brandService.exportMarketingFund(this.exportRequest).subscribe(() => {
      this.notification.showMessage('Export complete');
    });
  }

  public downloadTemplateFile(): void {
    this.downloadFileTemplateComponent.showDownloadFile();
  }

  public importFileDataClick(): void {
    this.importFile.open();
    // alert('Tính năng đang được update');
  }

  public onBtnUploadClick(): void {
    const confirm = new CustomConfirmation('BRAND.WARNING_IMPORT_ITEM_LIST');
    confirm.accept = () => {
      const files = this.importFile.tableFile.map((x) => x.file);
      this.brandService
        .import(files, this.request)
        .subscribe(
          (res) => {
            this.importFile.close();
            this.ngOnInit();
            this.notification.showSuccess();
            // this.cdr.detectChanges();
          }
        );
    };
    this.notification.confirm(confirm);
  }

  // public initData(): void {
  //   if (this.paginator) {
  //     this.request.pageIndex = this.paginator.pageIndex;
  //     this.request.pageSize = this.paginator.pageSize ? this.paginator.pageSize : 10;
  //   }
  //   const requestSub = forkJoin([
  //     this.brandService.selectAndCountPO(this.request),
  //     this.brandService.countAndCountPO(this.request)
  //   ]).subscribe(res => {
  //     this.dataSource.items = [];
  //     this.dataSource.paginatorTotal = res[1];
  //     res[0].forEach((element, index) => {
  //       const node = {
  //         data: {
  //           ...element,
  //           indexNo: this.request.pageIndex * this.request.pageSize + index + 1,
  //         },
  //         leaf: element.countPo > 0 ? false : true,
  //       };
  //       this.dataSource.items.push(node);
  //     });
  //     this.dataSource.items = [...this.dataSource.items];
  //     this.cdr.detectChanges();
  //   });
  //   this.subscriptions.push(requestSub);
  // }

  public onSearch(): void {
    this.initData();
  }

  public onBtnResetSearchClick() {
    this.request = new SupplierRequestPayload();
    this.initData();
  }

  public onBtnEditClick(id: string): void {
    this.router.navigate([`edit/${id}`], { relativeTo: this.route });
  }

  public onBtnViewClick(id: string): void {
    this.router.navigate([`view/${id}`], { relativeTo: this.route });
  }

  public onBtnDeleteClick(id: string): void {
    const confirmation = new DeleteConfirmation();
    confirmation.accept = () => {
      this.brandService.delete(id).subscribe(() => {
        this.initData();
        this.notification.showDeteleSuccess();
      });
    };
    this.notification.confirm(confirmation);
  }

  public onShowContextMenu() {
    // todo
  }

  public viewBrandFollowYear(rowData: any): void {
    this.brandViewYear.request.code = rowData.code;
    this.brandViewYear.request.name = rowData.name;
    this.brandViewYear.onBtnShowDialogListClick();
    this.cdr.detectChanges();
  }

  public groupBy(xs: any[], key: string) {
    return xs.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

  public convertCurrencyMask(price: any): string {
    if (price !== null && price !== undefined) {
      const result = this.format(price, 0, 3, ',', '.');
      return result;
    } else {
      return '';
    }
  }

  private format(value: any, n: any, x: any, s: any, c: any) {
    let result = '';
    if (value != null && value !== undefined) {
      if (typeof (value) === 'string') {
        value = parseFloat(value);
      }
      const re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')';
      const num = value.toFixed(Math.max(0, n));
      result = (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
    }
    return result;
  }

}
