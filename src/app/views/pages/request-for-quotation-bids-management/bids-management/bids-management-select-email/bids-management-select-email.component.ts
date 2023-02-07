import { ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SupplierSalesService } from '../../../../../services/modules/category/supplier-sales/supplier-sales.service';

export const BIDS_SELECT_EMAIL_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => BidsManagementSelectEmailComponent),
  multi: true
};

@Component({
  selector: 'app-bids-management-select-email',
  templateUrl: './bids-management-select-email.component.html',
  styleUrls: ['./bids-management-select-email.component.scss'],
  providers: [BIDS_SELECT_EMAIL_CONTROL_VALUE_ACCESSOR]
})
export class BidsManagementSelectEmailComponent implements OnInit {
  @Input() supplierId: string;

  @Input() placeholder: string;
  @Input() disabled = false;
  @Input() required = false;
  @Output() change: EventEmitter<any> = new EventEmitter();

  public value: any = null;

  public arrEmail = [];
  public showSpinner = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private supplierSalesService: SupplierSalesService
  ) { }

  onChange = (_: any) => { };
  onTouched = () => { };
  registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }

  writeValue(value: any) {
    this.value = value;
    this.cdr.detectChanges();
  }

  ngOnInit() {
  }

  public searchEmail() {
    this.arrEmail = [];
    if (this.supplierId) {
      this.showSpinner = true;
      const requestSupplierSales: any = { supplierId: this.supplierId };
      this.supplierSalesService.select(requestSupplierSales, false).subscribe(res => {
        this.arrEmail = res.map(m => m.email);
        this.showSpinner = false;
        this.cdr.detectChanges()
      });
    } else {
      this.cdr.detectChanges()
    }
  }

  public chooseEmail(data) {
    if (this.value) {
      let arrTemp = this.value.split(',');
      if (!arrTemp.some(m => m.trim().toLocaleLowerCase() === data.trim().toLocaleLowerCase())) {
        arrTemp.push(data.trim().toLocaleLowerCase())
      }
      arrTemp = arrTemp.map(m => {
        m = m.trim().toLocaleLowerCase();
        return m;
      });
      this.value = arrTemp.join(', ');
      this.onChange(this.value);
    } else {
      this.value = data ? data.trim().toLocaleLowerCase() : null;
      this.onChange(this.value);
    }
  }

  public onModelChangeInput(data: any) {
    this.onChange(data);
    this.change.emit(data);
    if (!this.value) {

    }
  }

  public onFocusOutInput() {
    if (this.value) {
      this.value = this.value.trim();
      this.onChange(this.value);
    }
  }

}
