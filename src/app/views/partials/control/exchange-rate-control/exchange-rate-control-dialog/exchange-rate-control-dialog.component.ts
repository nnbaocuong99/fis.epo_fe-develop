import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseListComponent } from '../../../../../core/_base/component/base-list.component';
import { DialogRef } from '../../../content/crud/dialog/dialog-ref.model';
import * as mainConfig from '../../../../../core/_config/main.config';
import { ExchangeRateTypeService } from '../../../../../services/modules/category/exchange-rate-type/exchange-rate-type.service';
import { BaseComponent } from '../../../../../core/_base/component/base-component';
import { ExchangeRateService } from '../../../../../services/modules/category/exchange-rate/exchange-rate.service';
import { ExchangeRateRequestPayload } from '../../../../../services/modules/category/exchange-rate/exchange-rate.request.payload';
import * as _moment from 'moment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-exchange-rate-control-dialog',
  templateUrl: './exchange-rate-control-dialog.component.html',
  styleUrls: ['./exchange-rate-control-dialog.component.scss'],
  providers: [DatePipe]
})
export class ExchangeRateControlDialogComponent extends BaseComponent implements OnInit {
  @Output() select: EventEmitter<any> = new EventEmitter();
  @Input() dialogRef: DialogRef = new DialogRef();
  @Input() class: any;

  public exchangeRateData: any = {};
  public exchangeRateTypeData: any = [];

  public selectedRow: any = {};
  public mainConfig = mainConfig.MAIN_CONFIG;
  public isDisabledConversionRate = true;

  constructor(
    public exchangeRateTypeService: ExchangeRateTypeService,
    public exchangeRateService: ExchangeRateService,
    private cdr: ChangeDetectorRef,
    private datePipe: DatePipe
  ) {
    super();
  }

  ngOnInit() {
    this.exchangeRateTypeService.select().subscribe(res => {
      if (res) {
        this.exchangeRateTypeData = res;
      } else {
        this.exchangeRateTypeData = [];
      }
    });
    this.exchangeRateData = this.dialogRef.input.exchangeRateData;
    this.exchangeRateData.date = this.exchangeRateData.date ? this.exchangeRateData.date : this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  public onSelectRow(): void {
    this.select.emit(this.exchangeRateData);
    this.dialogRef.hide();
  }

  public onChangeType(): void {
    // TODO tạm fix type user nhập cho phép nhập tỉ giá
    if (this.exchangeRateData.type === 'User') {
      this.isDisabledConversionRate = false;
    } else {
      this.isDisabledConversionRate = true;
    }
    this.getConversionRate();
  }

  public onChangeDate(): void {
    this.getConversionRate();
  }

  private getConversionRate(): void {
    this.exchangeRateData.conversionRate = null;
    const request = new ExchangeRateRequestPayload();
    request.type = this.exchangeRateData.type;
    request.date = this.exchangeRateData.date;
    request.currencyFrom = this.exchangeRateData.currencyFrom;
    request.currencyTo = 'VND';
    this.exchangeRateService.select(request).subscribe(res => {
      if (res) {
        this.exchangeRateData.conversionRate = res[0] ? res[0].conversionRate : null;
      } else {
        this.exchangeRateData.conversionRate = null;
      }
      this.cdr.detectChanges();
    });
  }
}
