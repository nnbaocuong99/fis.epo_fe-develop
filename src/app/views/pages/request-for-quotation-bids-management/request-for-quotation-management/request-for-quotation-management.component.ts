import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BaseComponent } from '../../../../core/_base/component/base-component';
import { NotificationService } from '../../../../services/common/notification/notification.service';
import { QuotationRequestPayload } from '../../../../services/modules/quotation/quotation.request-payload';
import { QuotationService } from '../../../../services/modules/quotation/quotation.service';
import { DialogRef } from '../../../partials/content/crud/dialog/dialog-ref.model';
import { ToolbarModel } from '../../../partials/content/toolbar/toolbar.model';
import * as config from './request-for-quotation-management.config';
import * as mainConfig from '../../../../core/_config/main.config';
import { forkJoin } from 'rxjs';
import { merge } from 'lodash';
import { tap } from 'rxjs/internal/operators/tap';
import { CustomConfirmation, DeleteConfirmation, SaveConfirmation } from '../../../../services/common/confirmation';
@Component({
  selector: 'app-request-for-quotation-management',
  templateUrl: './request-for-quotation-management.component.html',
  styleUrls: ['./request-for-quotation-management.component.scss']
})
export class RequestForQuotationManagementComponent extends BaseComponent implements OnInit {
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;

  selectedRowData: any;
  btnItems: MenuItem[] = [
    { label: 'Mời báo giá', icon: 'far fa-paper-plane', command: () => this.onBtnSenNotificationClick(this.selectedRowData) },
    // { label: 'Nhập báo giá', icon: 'fas fa-file-import', command: () => this.onBtnEnterQuoteClick(this.selectedRowData.id) },
    { label: 'Xem', icon: 'pi pi-fw pi-search', command: () => this.onBtnViewClick(this.selectedRowData.id) },
    { label: 'Sửa', icon: 'pi pi-fw pi-pencil', command: () => this.onBtnEditClick(this.selectedRowData.id) },
    { label: 'Xóa', icon: 'pi pi-fw pi-times', command: () => this.onBtnDeleteClick(this.selectedRowData.id) }
  ];

  public toolbarModel: ToolbarModel;
  public headers = config.HEADER;
  public mainConfig = mainConfig.MAIN_CONFIG;
  public statusQuotation = config.STATUS_QUOTATION;
  public request: any = new QuotationRequestPayload();
  public dataSource = {
    items: null,
    paginatorTotal: undefined
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    public quotationService: QuotationService,
    public notification: NotificationService
  ) {
    super();
  }

  ngOnInit() {
    this.configToolbar();
    this.initData();
    this.pagingData();
  }

  private configToolbar(): void {
    this.toolbarModel = new ToolbarModel();
    this.toolbarModel.option.show = false;
    this.toolbarModel.add.routerLink = ['quotation/add'];
  }

  public initData(): void {
    if (this.paginator) {
      this.request.pageIndex = this.paginator.pageIndex;
      this.request.pageSize = this.paginator.pageSize ? this.paginator.pageSize : 10;
    }
    const requests = [
      this.quotationService.select(this.request),
      this.quotationService.count(this.request)
    ];
    const sub = forkJoin(requests).subscribe(
      (response: any[]) => {
        this.dataSource.items = response[0];
        this.dataSource.paginatorTotal = response[1];
        this.cdr.detectChanges();
      });
    this.subscriptions.push(sub);
  }

  public pagingData(): void {
    if (this.paginator) {
      const paginatorSubscriptions = merge(this.paginator.page).pipe(
        tap(() => {
          this.initData();
        })
      ).subscribe();
      this.subscriptions.push(paginatorSubscriptions);
    }
  }

  public onBtnEditClick(id: string): void {
    this.router.navigate([`quotation/edit/${id}`], { relativeTo: this.route });
  }

  public onBtnViewClick(id: string): void {
    this.router.navigate([`quotation/view/${id}`], { relativeTo: this.route });
  }

  public onBtnDeleteClick(id: string): void {
    const confirmation = new DeleteConfirmation();
    confirmation.accept = () => {
      this.quotationService.delete(id).subscribe(() => {
        this.initData();
        this.notification.showDeteleSuccess();
      });
    };
    this.notification.confirm(confirmation);
  }

  public onShowContextMenu() {
    const rowData = this.selectedRowData;
    this.btnItems[0].visible = rowData.status !== 2 ? true : false;
    // this.btnItems[2].visible = rowData.status === 1 ? true : false;
  }

  public onBtnEnterQuoteClick(id: any): void {
    this.router.navigate([`quotation-enter/edit/${id}`], { relativeTo: this.route });
  }

  public onBtnSenNotificationClick(rowData: any): void {
    const confirm = new CustomConfirmation('Bạn có chắc muốn gửi mời báo giá?');
    confirm.accept = () => {
      this.quotationService.selectById(rowData.id).subscribe(res => {
        // Đổi trạng thái báo giá sang đã gửi : 2
        const dataSave: any = {
          ...res,
          status: 2
        };
        this.quotationService.invitation(dataSave).subscribe(() => {
          this.notification.showSuccess();
          this.initData();
          this.cdr.detectChanges();
        });
      });

    };
    this.notification.confirm(confirm);
  }
}
