import { Component, OnInit, ViewChild } from '@angular/core';
import * as config from './exchange-rate-currency.config';
import { ExchangeRateService } from '../../../../services/modules/category/exchange-rate/exchange-rate.service';
import { ExchangeRateRequestPayload } from '../../../../services/modules/category/exchange-rate/exchange-rate.request.payload';
import * as mainConfig from '../../../../core/_config/main.config';
import { CurrencyRequestPayload } from '../../../../services/modules/category/currency/currency.request.payload';
import { MatPaginator } from '@angular/material';
import { CurrencyService } from '../../../../services/modules/category/currency/currency.service';
import { forkJoin, merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BaseComponent } from '../../../../core/_base/component/base-component';

@Component({
  selector: 'app-exchange-rate-currency',
  templateUrl: './exchange-rate-currency.component.html',
  styleUrls: ['./exchange-rate-currency.component.scss']
})
export class ExchangeRateCurrencyComponent extends BaseComponent implements OnInit {
  @ViewChild('mpExchangeRate', { static: true }) mpExchangeRate: MatPaginator;
  @ViewChild('mpCurrency', { static: true }) mpCurrency: MatPaginator;
  public tabs = config.TABS;
  public headersExchangeRate = config.HEADER_EXCHANGE_RATE;
  public headersCurrency = config.HEADER_CURRENCY;
  public dataSourceExchangeRate = {
    items: [],
    paginatorTotal: undefined
  };
  public dataSourceCurrency = {
    items: [],
    paginatorTotal: undefined
  };
  public requestExchangeRate: ExchangeRateRequestPayload = new ExchangeRateRequestPayload();
  public requestCurrency: CurrencyRequestPayload = new CurrencyRequestPayload();
  public formTitle: string;
  public mainConfig: any;
  public isChangeTab = true;
  public isFirstLoad = false;

  constructor(
    public exchangeRateService: ExchangeRateService,
    public currencyService: CurrencyService) {
    super();
  }

  ngOnInit() {
    this.mainConfig = mainConfig.MAIN_CONFIG;
    this.formTitle = 'EXCHANGE_RATE_CURRENCY.HEADER_LIST';
    this.initDataExchangeRate();
    this.pagingDataExchangeRate();
  }

  public initDataExchangeRate(): void {
    // this.requestExchangeRate = new ExchangeRateRequestPayload();
    this.requestExchangeRate.pageIndex = this.mpExchangeRate.pageIndex;
    this.requestExchangeRate.pageSize = this.mpExchangeRate.pageSize ? this.mpExchangeRate.pageSize : 10;
    const paginatorSub = forkJoin([
      this.exchangeRateService.select(this.requestExchangeRate),
      this.exchangeRateService.count(this.requestExchangeRate)
    ]).subscribe(res => {
      this.dataSourceExchangeRate.items = res[0];
      this.dataSourceExchangeRate.paginatorTotal = res[1];
    });
    this.subscriptions.push(paginatorSub);
  }

  /**
   * Paging data
   */
  public pagingDataExchangeRate(): void {
    const paginatorSubscriptions = merge(this.mpExchangeRate.page).pipe(
      tap(() => {
        this.initDataExchangeRate();
      })
    ).subscribe();
    this.subscriptions.push(paginatorSubscriptions);
  }

  public initDataCurrency(): void {
   // this.requestCurrency = new CurrencyRequestPayload();
    this.requestCurrency.pageIndex = this.mpCurrency.pageIndex;
    this.requestCurrency.pageSize = this.mpCurrency.pageSize ? this.mpCurrency.pageSize : 10;
    const paginatorSub = forkJoin([
      this.currencyService.select(this.requestCurrency),
      this.currencyService.count(this.requestCurrency)
    ]).subscribe(res => {
      this.dataSourceCurrency.items = res[0];
      this.dataSourceCurrency.paginatorTotal = res[1];
    });
    this.subscriptions.push(paginatorSub);
  }

  /**
   * Paging data
   */
  public pagingDataCurrency(): void {
    const paginatorSubscriptions = merge(this.mpCurrency.page).pipe(
      tap(() => {
        this.initDataCurrency();
      })
    ).subscribe();
    this.subscriptions.push(paginatorSubscriptions);
  }

  public setFragmentToRoute(): void {
    if (!this.isFirstLoad) {
      this.initDataCurrency();
      this.pagingDataCurrency();
      this.isFirstLoad = true;
    }
    this.isChangeTab = !this.isChangeTab;
  }
}

