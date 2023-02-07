import { ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputMask } from 'primeng/inputmask';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'input-date',
  templateUrl: './input-date.component.html',
  styleUrls: ['./input-date.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputDateComponent),
    multi: true
  }]
})
export class InputDateComponent implements OnInit {
  @Input() disabled: boolean;
  @Input() readonly: boolean;
  @Output() change: EventEmitter<any> = new EventEmitter();
  @Output() focus: EventEmitter<any> = new EventEmitter();
  @Output() blur: EventEmitter<any> = new EventEmitter();
  @Input() class: string;

  /**
   * Holds the current value of the slider
   */
  viewValue = null;
  _value = null;
  get value(): any {
    return this._value;
  }
  set value(v: any) {
    if (v !== this._value) {
      this._value = v;
      this.viewValue = this.transformValueToView(this._value);
      this.onChange(v);
      this.change.emit(v);
    }
  }

  private transformValueToView(value: string) {
    if (value) {
      const dateTrans = value.replace(/-/g, '/').split('/');
      const year = dateTrans[0];
      const month = dateTrans[1];
      const day = dateTrans[2];
      return `${this.pad(day)}-${this.pad(month)}-${this.pad(year)}`;
    } else {
      return null;
    }
  }

  /**
   * Invoked when the model has been changed
   */
  onChange: (_: any) => void = (_: any) => { };

  /**
   * Invoked when the model has been touched
   */
  onTouched: () => void = () => { };

  constructor(public cd: ChangeDetectorRef) { }

  ngOnInit() {
  }

  /**
   * Method that is invoked on an update of a model.
   */
  updateChanges() {
    this.onChange(this._value);
  }

  ///////////////
  // OVERRIDES //
  ///////////////

  /**
   * Writes a new item to the element.
   * @param value the value
   */
  writeValue(value: string): void {
    const result = this.checkStringDate(value);
    if (result.result && this._value !== result.value) {
      this._value = result.value;
      this.updateChanges();
    } else if (!result.result) {
      this._value = null;
      this.updateChanges();
    }
  }

  /**
   * Registers a callback function that should be called when the control's value changes in the UI.
   * @param fn
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Registers a callback function that should be called when the control receives a blur event.
   * @param fn
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  private checkStringDate(stringValue: string | Date | null): any {
    const result = {
      result: true,
      value: null
    };

    if (stringValue) {
      const date = new Date(stringValue);
      if (isNaN(date.getDate())) {
        result.result = false;
        this.viewValue = null;
      } else {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        if (!this.isValidDate(year, month, day)) {
          result.result = false;
          this.viewValue = null;
        } else {
          result.value = `${this.pad(year)}-${this.pad(month)}-${this.pad(day)}`;
          this.viewValue = `${this.pad(day)}-${this.pad(month)}-${this.pad(year)}`;
        }
      }
    }
    return result;
  }

  private pad(a: number | string): string {
    if (+a < 10) {
      return '0' + +a;
    } else {
      return '' + +a;
    }
  }

  /**
   * Check valid date
   */
  private isValidDate(year: number, month: number, day: number): boolean {
    const d = new Date(year, month - 1, day);
    if (d.getFullYear() === +year && d.getMonth() + 1 === +month && d.getDate() === +day) {
      return true;
    }
    return false;
  }

  public onBlurInputMask(): void {
    if (!this.viewValue) {
      this.resetValue();
    } else {
      this.viewValue = this.viewValue.replace(/-/g, '/');
      const values = this.viewValue.split('/');
      const day = values[0];
      const month = values[1];
      const year = values[2];
      if (this.isValidDate(year, month, day)) {
        this.value = `${this.pad(year)}-${this.pad(month)}-${this.pad(day)}`;
      } else {
        this.resetValue();
      }
    }
  }

  public onCompleteInputMask(): void {
    if (this.viewValue) {
      const values = this.viewValue.split('/');
      const day = values[0];
      const month = values[1];
      const year = values[2];
      if (this.isValidDate(year, month, day)) {
        this.value = `${this.pad(year)}-${this.pad(month)}-${this.pad(day)}`;
      } else {
        this.value = null;
      }
    }
  }

  public onInput(control: InputMask): void {
    // When clear
    if (control.value === control.slotChar) {
      this.resetValue();
    } else {
      if (!control.isCompleted()) {
        this.value = null;
      }
    }
  }

  private resetValue(): void {
    this.value = null;
    this.viewValue = null;
    // tslint:disable-next-line:no-string-literal
    if (this.cd && !this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  onClickOpenFormDate(event): void {
    if (this.readonly) {
      event.preventDefault();
    }
  }
}
