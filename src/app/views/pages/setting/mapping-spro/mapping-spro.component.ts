import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import * as config from './mapping-spro.config';
import { MappingSproRequestPayload } from '../../../../services/modules/mapping-spro/mapping-spro.request.payload';
import { MappingSproService } from '../../../../services/modules/mapping-spro/mapping-spro.service';
import { BaseListComponent } from '../../../../core/_base/component/base-list.component';
import { MatPaginator } from '@angular/material';
import { forkJoin, merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BaseComponent } from '../../../../core/_base/component/base-component';

@Component({
  selector: 'app-mapping-spro',
  templateUrl: './mapping-spro.component.html',
  styleUrls: ['./mapping-spro.component.scss']
})
export class MappingSproComponent extends BaseComponent implements OnInit {
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;

  public modules = config.MODULE;
  public headers = config.HEADER;
  public request: any = {};
  public dataSource = {
    items: null,
    paginatorTotal: undefined
  };

  constructor(
    private cdr: ChangeDetectorRef,
    public mappingSproService: MappingSproService) {
    super();
  }

  ngOnInit() {
    this.initData();
    this.pagingData();
  }

  public initData(): void {
    if (this.paginator) {
      this.request.pageIndex = this.paginator.pageIndex;
      this.request.pageSize = this.paginator.pageSize ? this.paginator.pageSize : 10;
    }
    const requests = [
      this.mappingSproService.select(this.request),
      this.mappingSproService.count(this.request)
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

}
