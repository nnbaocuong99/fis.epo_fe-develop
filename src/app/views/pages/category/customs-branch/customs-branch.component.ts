import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import * as config from './customs-branch.config';
import * as mainConfig from '../../../../core/_config/main.config';
import { ToolbarModel } from '../../../partials/content/toolbar/toolbar.model';
import { BaseComponent } from '../../../../core/_base/component/base-component';
import { MatPaginator } from '@angular/material/paginator';
import { MenuItem } from 'primeng/api';
import { forkJoin, merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DeleteConfirmation } from '../../../../services/common/confirmation/delete-confirmation';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomsBranchRequestPayload } from '../../../../services/modules/category/customs-branch/customs-branch.request.payload';
import { CustomsBranchService } from '../../../../services/modules/category/customs-branch/customs-branch.service';
import { NotificationService } from '../../../../services/common/notification/notification.service';

@Component({
  selector: 'app-customs-branch',
  templateUrl: './customs-branch.component.html',
  styleUrls: ['./customs-branch.component.scss']
})
export class CustomsBranchComponent extends BaseComponent implements OnInit {
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;

  selectedRowData: any;
  btnItems: MenuItem[] = [
    { label: 'Xem', icon: 'pi pi-fw pi-search', command: () => this.onBtnViewClick(this.selectedRowData.id) },
    { label: 'Sửa', icon: 'pi pi-fw pi-pencil', command: () => this.onBtnEditClick(this.selectedRowData.id) },
    { label: 'Xóa', icon: 'pi pi-fw pi-times', command: () => this.onBtnDeleteClick(this.selectedRowData.id) }
  ];

  public toolbarModel: ToolbarModel;
  public headers = config.HEADER;
  public mainConfig = mainConfig.MAIN_CONFIG;
  public request: any = new CustomsBranchRequestPayload();
  public dataSource = {
    items: null,
    paginatorTotal: undefined
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    public customsBranchService: CustomsBranchService,
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
      this.request.pageSize = this.paginator.pageSize ? this.paginator.pageSize : 10;
    }
    const requests = [
      this.customsBranchService.select(this.request),
      this.customsBranchService.count(this.request)
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
      this.customsBranchService.delete(id).subscribe(() => {
        this.initData();
        this.notification.showDeteleSuccess();
      });
    };
    this.notification.confirm(confirmation);
  }

  public onShowContextMenu() {
    // TODO
  }

}
