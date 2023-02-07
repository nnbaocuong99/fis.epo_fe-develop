import { ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnInit, Output, ViewRef } from '@angular/core';
import { NgForm, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DialogRef } from '../../content/crud/dialog/dialog-ref.model';

export const EXCHANGE_RATE_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ExchangeRateControlComponent),
  multi: true
};

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'exchange-rate',
  templateUrl: './exchange-rate-control.component.html',
  styleUrls: ['./exchange-rate-control.component.scss'],
  providers: [EXCHANGE_RATE_CONTROL_VALUE_ACCESSOR]
})

export class ExchangeRateControlComponent implements OnInit {
  public dialogRef: DialogRef = new DialogRef();
  @Input() name: string;
  @Input() bindValue: string;
  @Input() disabled: boolean;
  @Input() exchangeRateData: any = {
    type: null,
    date: null,
    conversionRate: null
  };
  @Input() class: any;

  @Output() change: EventEmitter<any> = new EventEmitter();

  public isShowDialog = false;
  constructor(
    private cdr: ChangeDetectorRef
  ) { }

  public value: any = null;

  writeValue(value: any) {
    this.value = value;
    if (this.cdr && !(this.cdr as ViewRef).destroyed) {
      this.cdr.detectChanges();
    }
  }

  onChange = (_: any) => { };
  onTouched = () => { };
  registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }

  ngOnInit() {
  }

  public onBtnShowDialogListClick(): void {
    this.isShowDialog = false;
    this.cdr.detectChanges();
    this.isShowDialog = true;
    const exchangeRateData = JSON.parse(JSON.stringify(this.exchangeRateData));
    this.dialogRef.input = {
      name: this.name,
      conversionRate: this.value,
      exchangeRateData: exchangeRateData
    };
    this.dialogRef.show();
  }

  public onSelectRow(rowData: any) {
    this.value = rowData[this.bindValue];
    this.exchangeRateData = rowData;
    this.onChange(this.value);
    this.change.emit(rowData);
  }
}
