import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { forkJoin } from 'rxjs';
import { BaseComponent } from '../../../../../../core/_base/component/base-component';
import { ActionRequestPayload } from '../../../../../../services/modules/action/action.request.payload';
import { ActionService } from '../../../../../../services/modules/action/action.service';
import { OperationService } from '../../../../../../services/modules/operation/operation.service';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent extends BaseComponent implements OnInit {
  public dataSource: any = {};
  public dataSourceAction: any = {};
  public request = new ActionRequestPayload();
  public actionRequest = new ActionRequestPayload();
  public operationId: any
  public selectedAction: any = {};
  public inOutType = [{ label: 'Request', value: 0 }, { label: 'Response', value: 1 }]
  constructor(
    public actionService: ActionService,
    public operationService: OperationService,
    public cd: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    this.request.pageIndex = 0;
    this.request.pageSize = 10;
    this.actionRequest.pageIndex = 0;
    this.actionRequest.pageSize = 10;
    this.dataSourceAction.items = null;
    this.dataSourceAction.paginatorTotal = null;

    this.selectedAction = null;
    this.initData();
    this.initActionData();
  }

  public initActionInOut() {
    this.actionRequest.id = this.selectedAction.id;
    this.initActionData();
  }
  public resetActionInOut() {
    this.dataSourceAction.items = null;
    this.dataSourceAction.paginatorTotal = null;
    this.selectedAction = null;
  }

  public filterData(): void {
    const $selectAndCount = [
      this.actionService.select(this.request, false),
      this.actionService.count(this.request, false),
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


  private initActionData(): void {
    const $selectAndCount = [
      this.actionService.selectActionInOut(this.actionRequest),
      this.actionService.countActionInOut(this.actionRequest)
    ];

    const sub = forkJoin($selectAndCount).subscribe(
      (response: any[]) => {
        this.dataSourceAction.items = response[0];
        this.dataSourceAction.paginatorTotal = response[1];
        if (this.cd && !this.cd['destroyed']) {
          this.cd.detectChanges();
        }
      });

    this.subscriptions.push(sub);
  }

  public onActionPageChange(event: PageEvent) {
    this.actionRequest.pageIndex = event.pageIndex;
    this.actionRequest.pageSize = event.pageSize;
    this.initActionData();
  }
  public onMethod(s: string): string {
    if (s === "post") {
      return "{'text-align': 'center'; 'background-color': 'blue';'background-clip': 'content-box';'padding':'5px';'color': 'white';}"
    }
    if (s === "put") {
      return "{'text-align': 'center'; 'background-color':'pink';'background-clip':'content-box';'padding':'5px';'color': 'white';}"
    }
    if (s === "get") {
      return "{'text-align': 'center'; 'background-color': 'green';'background-clip':'content-box';'padding':'5px';'color': 'white';}"
    }

    if (s === "delete") {
      return "{'text-align': 'center'; 'background-color': 'red';'background-clip':'content-box';'padding':'5px';'color': 'white';}"
    }
  }

}

