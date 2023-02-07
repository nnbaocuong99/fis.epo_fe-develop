import { ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { HttpService } from '../../../../../services/common/http/http.service';
import { RequestPayload } from '../../../../../services/common/http/request-payload.model';

export const NG_SELECT_ADD_TAG: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NgSelectAddTagComponent),
  multi: true
};

@Component({
  selector: 'app-ng-select-add-tag',
  templateUrl: './ng-select-add-tag.component.html',
  styleUrls: ['./ng-select-add-tag.component.scss'],
  providers: [NG_SELECT_ADD_TAG]
})
export class NgSelectAddTagComponent implements OnInit {
  @Input() service: HttpService;
  @Input() request: any = new RequestPayload();
  @Input() bindLabel: string;
  @Input() bindValue: string;
  @Input() placeholder: string;
  @Output() change: EventEmitter<any> = new EventEmitter();

  public items = [];
  addTag = m => m;

  private privateValue: any = null;
  get value(): any { return this.privateValue; }
  set value(v: any) {
    if (v !== this.privateValue) {
      this.privateValue = v;
      this.onChange(v);
    }
  }

  writeValue(value: any) {
    if (value) {
      this.privateValue = value;
      this.onChange(value);
    }
  }

  onChange = (_: any) => { };
  onTouched = () => { };
  registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }

  constructor(
    public cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
  }

  public onScrollToEnd(): void {
    this.request.pageSize += 10;
    this.onSearch(null, true);
  }

  public onOpen(): void {
    this.request.pageIndex = 0;
    this.request.pageSize = 10;
    this.request.name = null;
    this.onSearch();
  }

  public onSearch(event?: any, addPlus?: boolean): void {
    if (event) {
      this.request.name = event.term;
    }
    this.service.select(this.request, false).subscribe(m => {
      this.items = addPlus ? this.items.concat(m) : m;
      this.cdr.detectChanges();
    });
  }

  public onClear() {
    console.log('onClear');
    this.onSearch();
  }

  public onChangeValue(value) {
    this.change.emit(value);
  }
}
