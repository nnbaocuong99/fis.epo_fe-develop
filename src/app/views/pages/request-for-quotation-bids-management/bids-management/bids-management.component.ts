import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';
import * as config from './bids-management.config';
import * as mainConfig from '../../../../core/_config/main.config';
import { BaseComponent } from '../../../../core/_base/component/base-component';
import { merge } from 'lodash';
import { tap } from 'rxjs/internal/operators/tap';
import { BidsService } from '../../../../services/modules/bids/bids.service';
import { BidsRequestPayload } from '../../../../services/modules/bids/bids.request-payload';
import { forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolbarModel } from '../../../partials/content/toolbar/toolbar.model';
import { MenuItem } from 'primeng/api';
import { DeleteConfirmation } from '../../../../services/common/confirmation/delete-confirmation';
import { NotificationService } from '../../../../services/common/notification/notification.service';
import { SaveConfirmation } from '../../../../services/common/confirmation/save-confirmation';

@Component({
  selector: 'app-bids-management',
  templateUrl: './bids-management.component.html',
  styleUrls: ['./bids-management.component.scss']
})
export class BidsManagementComponent extends BaseComponent implements OnInit {
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;

  selectedRowData: any;
  btnItems: MenuItem[] = [
    { label: 'Mời tham gia', icon: 'far fa-paper-plane', command: () => this.onBtnInvitationClick(this.selectedRowData, 2) },
    { label: 'Mời đấu giá', icon: 'far fa-paper-plane', command: () => this.onBtnInvitationClick(this.selectedRowData, 3) },
    { label: 'Kết thúc đấu giá', icon: 'far fa-check-circle', command: () => this.onBtnInvitationClick(this.selectedRowData, 4) },
    { label: 'Xem', icon: 'pi pi-fw pi-search', command: () => this.onBtnViewClick(this.selectedRowData.id) },
    { label: 'Sửa', icon: 'pi pi-fw pi-pencil', command: () => this.onBtnEditClick(this.selectedRowData.id) },
    { label: 'Xóa', icon: 'pi pi-fw pi-times', command: () => this.onBtnDeleteClick(this.selectedRowData.id) }
  ];

  public toolbarModel: ToolbarModel;
  public headers = config.HEADER;
  public arrStatus = config.BIDS_STATUS;
  public mainConfig = mainConfig.MAIN_CONFIG;
  public request: any = new BidsRequestPayload();
  public dataSource = {
    items: null,
    paginatorTotal: undefined
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    public bidsService: BidsService,
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
    this.toolbarModel.add.routerLink = ['add'];
  }

  public initData(): void {
    if (this.paginator) {
      this.request.pageIndex = this.paginator.pageIndex;
      this.request.pageSize = this.paginator.pageSize ? this.paginator.pageSize : 5;
    }
    const requests = [
      this.bidsService.select(this.request),
      this.bidsService.count(this.request)
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
    this.router.navigate([`edit/${id}`], { relativeTo: this.route });
  }

  public onBtnViewClick(id: string): void {
    this.router.navigate([`view/${id}`], { relativeTo: this.route });
  }

  public onBtnDeleteClick(id: string): void {
    const confirmation = new DeleteConfirmation();
    confirmation.accept = () => {
      this.bidsService.delete(id).subscribe(() => {
        this.initData();
        this.notification.showDeteleSuccess();
      });
    };
    this.notification.confirm(confirmation);
  }

  public onBtnInvitationClick(rowData: any, statusValue: number): void {
    const saveConfirmation = new SaveConfirmation();
    saveConfirmation.accept = () => {
      this.bidsService.selectById(rowData.id).subscribe(res => {
        const dataSave: any = {
          ...res,
          status: statusValue
        };
        this.bidsService.invitation(dataSave).subscribe(() => {
          this.notification.showSuccess();
          this.initData();
          this.cdr.detectChanges();
        });
      });
    };
    this.notification.confirm(saveConfirmation);
  }

  public onShowContextMenu() {
    this.btnItems[0].visible = !this.selectedRowData.status;
    this.btnItems[1].visible = this.selectedRowData.status === 2;
    this.btnItems[2].visible = this.selectedRowData.status === 3;
  }

}
