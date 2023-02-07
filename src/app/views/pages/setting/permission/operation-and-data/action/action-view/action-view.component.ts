import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { forkJoin } from 'rxjs';
import { BaseComponent } from '../../../../../../../core/_base/component/base-component';
import { ActionRequestPayload } from '../../../../../../../services/modules/action/action.request.payload';
import { ActionService } from '../../../../../../../services/modules/action/action.service';
import { OperationService } from '../../../../../../../services/modules/operation/operation.service';

@Component({
  selector: 'app-action-view',
  templateUrl: './action-view.component.html',
  styleUrls: ['./action-view.component.scss']
})
export class ActionViewComponent extends BaseComponent implements OnInit {
  public dataSource: any = {};
  public selectedActions = [];
  public request = new ActionRequestPayload();
  public operationId: any
  public selectedAction = [];
  constructor(
    public actionService: ActionService,
    public operationService: OperationService,
    public cd: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    this.request.pageIndex = 0;
    this.request.pageSize = 10;

    this.initData();
  }

  public initData(): void {
    const $selectAndCount = [
      this.actionService.select(this.request),
      this.actionService.count(this.request),
    
    ];

    const sub = forkJoin($selectAndCount).subscribe(
      (response: any[]) => {
        this.dataSource.items = response[0];
        this.dataSource.paginatorTotal = response[1];
        if (this.cd && !this.cd['destroyed']) {
          this.cd.detectChanges();
        }
      });

    this.subscriptions.push(sub);
  }

  public onPageChange(event: PageEvent) {
    this.request.pageIndex = event.pageIndex;
    this.request.pageSize = event.pageSize;
    this.initData();
  }

  // public onActionShow(operationId: any){
  //   this.operationService.selectActionById(operationId).subscribe(res => {
  //     this.selectedActions = res
  // })
  // }
}
