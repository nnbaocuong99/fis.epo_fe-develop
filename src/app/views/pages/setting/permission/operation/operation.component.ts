import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { RoleRequestPayload } from '../../../../../services/modules/role/role.request.payload';
import { BaseComponent } from '../../../../../core/_base/component/base-component';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DialogRef } from '../../../../partials/content/crud/dialog/dialog-ref.model';
import { OperationService } from '../../../../../services/modules/operation/operation.service';

@Component({
  selector: 'app-operation',
  templateUrl: './operation.component.html',
  styleUrls: ['./operation.component.scss']
})
export class OperationComponent extends BaseComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  public dialogRef: DialogRef = new DialogRef();
  public dataSource = {
    items: [],
    paginatorTotal: undefined
  };
  public headers = [
    { width: '50px', title: 'No' },
    { width: '200px', title: 'Name' },
    { width: '100px', title: 'Code' }
  ];
  public request = new RoleRequestPayload();

  constructor(
    public operationService: OperationService,
    private cd: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    this.initData();
    const paginatorSubscriptions = merge(this.paginator.page).pipe(
      tap(() => {
        this.initData();
      })
    ).subscribe();
    this.subscriptions.push(paginatorSubscriptions);
  }

  /**
   * Initialize data for screen
   */
  public initData(): void {
    this.request.pageIndex = this.paginator.pageIndex;
    this.request.pageSize = this.paginator.pageSize ? this.paginator.pageSize : 10;
    const subSelect = this.operationService.select(this.request).subscribe(res => {
      this.dataSource.items = res;
      this.cd.detectChanges();
    });
    const subCount = this.operationService.count(this.request).subscribe(res => {
      this.dataSource.paginatorTotal = res;
      this.cd.detectChanges();
    });
    this.subscriptions.push(...[subSelect, subCount]);
  }

  public onBtnEditClick(rowData?: any): void {
    this.dialogRef.output = rowData;
    if (rowData) {
      const subEdit = this.operationService.selectById(rowData.id).subscribe(res => {
        this.dialogRef.input = res;
        this.dialogRef.input.isShowDelete = true;
        this.dialogRef.show();
        this.cd.detectChanges();
      });
      this.subscriptions.push(subEdit);
    } else {
      this.dialogRef.input = {};
      this.dialogRef.input.type = 1;
      this.dialogRef.input.method = 'MENU';
      this.dialogRef.input.menuOrder = 0;
      this.dialogRef.input.isShowDelete = true;
      this.dialogRef.show();
      this.cd.detectChanges();
    }
  }

  public onSuccess(event: boolean) {
    if (event) {
      this.initData();
    }
  }
}
