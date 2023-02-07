import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BaseComponent } from '../../../../../../../core/_base/component/base-component';
import { EContractRequestPayload } from '../../../../../../../services/modules/contract/contract.request.payload';
import { ContractService } from '../../../../../../../services/modules/contract/contract.service';
import * as config from '../input-contract.config';

@Component({
  selector: 'app-list-contract',
  templateUrl: './list-contract.component.html'
})
export class ListContractComponent extends BaseComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  public cols = config.COL_TBL_CONTRACT;
  public request: any;
  public dataSource = {
    items: [],
    paginatorTotal: undefined
  };
  public selectedContract: any;

  constructor(public contractService: ContractService) {
    super();
  }

  ngOnInit() {
    this.request = new EContractRequestPayload();
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
    const subSelect = this.contractService.searchEContract(this.request).subscribe(res => {
      this.dataSource.items = res.records;
      this.dataSource.paginatorTotal = res.totalRecords;
    });
    this.subscriptions.push(...[subSelect]);
  }
}
