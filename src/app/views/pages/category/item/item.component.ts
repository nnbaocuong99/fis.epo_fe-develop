import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import * as config from './item.config';
import * as mainConfig from '../../../../core/_config/main.config';
import { ItemService } from '../../../../services/modules/category/item/item.service';
import { ItemRequestPayload } from '../../../../services/modules/category/item/item.request.payload';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { BaseComponent } from '../../../../core/_base/component/base-component';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { merge } from 'lodash';
import { tap } from 'rxjs/internal/operators/tap';
import { CustomMatPaginatorIntlForItemCategory } from '../../../partials/common/custom-mat-paginator-for-item-category';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  providers: [{
    provide: MatPaginatorIntl,
    useClass: CustomMatPaginatorIntlForItemCategory
  }]
})
export class ItemComponent extends BaseComponent implements OnInit {

  @ViewChild('paginator', { static: true }) paginator: MatPaginator;

  public headers = config.HEADER;
  public mainConfig = mainConfig.MAIN_CONFIG;;
  public request = new ItemRequestPayload();
  public formTitle = 'ITEM.HEADER_LIST';
  public dataSource = {
    items: null,
    paginatorTotal: undefined
  };

  constructor(
    public itemService: ItemService,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    this.request.type = 'pagination_list';
    this.initData();
    this.pagingData();
  }

  public initData(): void {
    if (this.paginator) {
      this.request.pageIndex = this.paginator.pageIndex;
      this.request.pageSize = this.paginator.pageSize ? this.paginator.pageSize : 10;
    }
    const requests = [
      this.itemService.select(this.request),
      // this.itemService.count(this.request)
    ];
    const sub = forkJoin(requests).subscribe(
      (response: any[]) => {
        this.dataSource.items = response[0];
        if (this.dataSource.items.length < this.request.pageSize) {
          this.dataSource.paginatorTotal = this.dataSource.items.length;
        } else {
          this.dataSource.paginatorTotal = (this.request.pageIndex + 2) * this.request.pageSize;
        }
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
