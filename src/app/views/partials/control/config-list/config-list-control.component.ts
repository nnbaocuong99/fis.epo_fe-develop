import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { NgForm, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ConfigListService } from '../../../../services/modules/config-list/config-list.service';
import { DialogRef } from '../../content/crud/dialog/dialog-ref.model';
import { ConfigListLoader } from './config-list-control.service';

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ConfigListControlComponent),
  multi: true
};

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'config-list-control',
  templateUrl: './config-list-control.component.html',
  styleUrls: ['./config-list-control.component.scss'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class ConfigListControlComponent implements OnInit {
  @Input() form: NgForm;
  @Input() type: string;
  @Input() header: string;
  @Input() hasEdit = true;
  @Input() hasDefaultValue = true;
  @Input() bindLabel: string;
  @Input() bindValue: string;
  @Input() attr1Name: string;
  @Input() attr2Name: string;
  @Input() attr3Name: string;
  @Input() attr4Name: string;
  @Input() items: any;
  @Input() isDisabled = false;
  @Input() orderBy: string;
  @Input() sortFn: (a: any, b: any) => number;
  @Output() getChange: EventEmitter<any> = new EventEmitter();

  public dialogRef: DialogRef = new DialogRef();
  public dataSource: any;
  public itemsClone: any;
  public isShowConfigList = false;
  constructor(
    private cdr: ChangeDetectorRef,
    public configListService: ConfigListService,
    public loader: ConfigListLoader) { }

  private privateValue: any = '';
  get value(): any { return this.privateValue; }
  set value(v: any) {
    if (v !== this.privateValue) {
      this.privateValue = v;
      this.onChange(v);
    }
  }

  writeValue(value: any) {
    this.privateValue = value;
    this.onChange(value);
  }

  onChange = (_: any) => { };
  onTouched = () => { };
  registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }

  ngOnInit() {
    this.configListService.isLoadingSubject.subscribe((value) => {
      if (!value) {
        const source: any[] = JSON.parse(sessionStorage.listConfig ? sessionStorage.listConfig : '[]');
        if (!this.sortFn) {
          this.sortFn = () => 0;
        }
        this.items = source.filter(x => x.type === this.type).sort(this.sortFn);
        this.getDataConfigList(this.items);
        if (this.items && this.itemsClone) {
          this.items = this.items.length === this.itemsClone.length ? this.items : this.itemsClone;
        }
      }
    });
  }

  public onBtnAddCostTypeClick(): void {
    this.isShowConfigList = false;
    this.cdr.detectChanges();
    this.isShowConfigList = true;
    this.dialogRef.show();
  }

  public getDataConfigList(configListData: any) {
    if (this.orderBy) {
      configListData.sort((a, b) => {
        const str1 = a[this.orderBy] ? a[this.orderBy] : '';
        const str2 = b[this.orderBy] ? b[this.orderBy] : '';
        if (str1 < str2) { return -1; }
        if (str1 > str2) { return 1; }
        return 0;
      });
    }
    this.items = configListData;
    this.itemsClone = configListData;
  }

  public onChangeSelect(value: string): void {
    this.getChange.emit(this.items.find(x => x.name === value));
  }
}
