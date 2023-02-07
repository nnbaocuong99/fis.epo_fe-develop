import { ChangeDetectorRef, Component, EventEmitter, forwardRef, HostListener, Input, OnInit, Output, ViewRef } from '@angular/core';
import { NgForm, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { HttpService } from '../../../../services/common';
import { DialogRef } from '../../content/crud/dialog/dialog-ref.model';

export const SELECT_SYNC_SOURCE_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectSyncSourceComponent),
  multi: true
};

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'select-sync-source',
  templateUrl: './select-sync-source.component.html',
  styleUrls: ['./select-sync-source.component.scss'],
  providers: [SELECT_SYNC_SOURCE_CONTROL_VALUE_ACCESSOR]
})

export class SelectSyncSourceComponent implements OnInit {
  public dialogRef: DialogRef = new DialogRef();
  public dialogRefAdd: DialogRef = new DialogRef();
  @Input() placeholder: string;
  @Input() name: string;
  @Input() service: any;
  @Input() header: string;
  @Input() columns: any;
  @Input() requestPayload: any = {};
  @Input() bindValue: string;
  @Input() suffixLabel: string;
  @Input() disabled: boolean;
  @Input() required = false;
  @Input() canEditInput = false;
  @Input() width = '90vw';
  @Input() canAdd = false;
  @Input() isOnTable = false;
  @Input() categoryType: string;
  @Input() searchField: string;
  @Input() actionGetName: string;
  @Input() actionCountName: string;

  @Output() change: EventEmitter<any> = new EventEmitter();
  @Output() addNew: EventEmitter<any> = new EventEmitter();
  @Output() focus: EventEmitter<any> = new EventEmitter();
  @Output() blur: EventEmitter<any> = new EventEmitter();

  public isShowDialog = false;
  public value: any = null;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.code) {
      case 'Enter':
        event.preventDefault();
        break;
      default:
        break;
    }
  }
  constructor(
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
  ) { }

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
    this.dialogRef.input = {
      service: this.service,
      header: this.header,
      columns: this.columns,
      requestPayload: this.requestPayload,
      name: this.name,
      width: this.width
    };
    this.dialogRef.show();
  }

  public onSelectRow(rowData: any) {
    if (this.isOnTable) {
      this.value = rowData[this.bindValue];
    } else {
      this.value = rowData;
    }
    this.onChange(this.value);
    this.change.emit(rowData);
  }

  public onChangeNgSelectAsync(rowData: any) {
    this.value = rowData;
    this.onChange(rowData);
    this.change.emit(rowData);
  }

  public onModelChangeInput(data: any) {
    this.onChange(data);
    this.change.emit(data);
  }

  public onChangeInput(event: any) {
    if (!this.canEditInput) {
      event.preventDefault();
    }
  }

  public addNewItem(): void {
    this.dialogRefAdd.input = {
      service: this.service
    };
    this.dialogRefAdd.config = {
      style: { width: '750px' },
      baseZIndex: 10000,
      draggable: true,
      maximizable: true,
      title: this.translate.instant('COMMON.CRUD.ADD') + ' ' + this.translate.instant(this.placeholder),
      btnTitle: 'COMMON.SAVE'
    };
    this.dialogRefAdd.show();
  }
}
