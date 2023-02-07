import { ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseListComponent } from '../../../../core/_base/component/base-list.component';
import { NotificationService } from '../../../../services/common/notification/notification.service';
import { MilestoneService } from '../../../../services/modules/category/milestone/milestone.service';
import { DialogRef } from '../../content/crud/dialog/dialog-ref.model';
import * as config from './select-project-milestone.config';
import * as mainConfig from '../../../../core/_config/main.config';
import { MilestoneRequestPayload } from '../../../../services/modules/category/milestone/milestone.request.payload';

export const SELECT_SYNC_SOURCE_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectProjectMilestoneComponent),
  multi: true
};

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'select-project-milestone',
  templateUrl: './select-project-milestone.component.html',
  styleUrls: ['./select-project-milestone.component.scss'],
  providers: [SELECT_SYNC_SOURCE_CONTROL_VALUE_ACCESSOR]
})
export class SelectProjectMilestoneComponent extends BaseListComponent implements OnInit {
  @ViewChild('form', { static: true }) form: NgForm;
  public dialogRef: DialogRef = new DialogRef();
  @Input() placeholder: string;
  @Input() projectCode: string;
  @Input() disabled: boolean;
  @Output() change: EventEmitter<any> = new EventEmitter();
  @Output() saveFirstRow: EventEmitter<any> = new EventEmitter();

  public selectedProjectMilestone: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private milestoneService: MilestoneService) {
    super();
  }

  public value: any = null;

  writeValue(value: any) {
    this.value = value;
  }

  onChange = (_: any) => { };
  onTouched = () => { };
  registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }

  ngOnInit() {
    this.baseService = this.milestoneService;
    this.headers = config.HEADER;
    this.mainConfig = mainConfig.MAIN_CONFIG;
    this.request = new MilestoneRequestPayload();
    this.request.projectCode = this.projectCode;
    this.formTitle = 'SUPPLIER.HEADER_LIST';
    this.pagingData();
  }

  public onBtnShowDialogListClick(): void {
    this.cdr.detectChanges();
    this.request.projectCode = this.projectCode;
    this.initData();
    this.dialogRef.show();
  }

  public close() {
    this.dialogRef.hide();
  }

  public onBtnSaveClick(): void {
    this.value = this.selectedProjectMilestone.outlineNumber;
    this.onChange(this.value);
    this.saveFirstRow.emit();
    this.change.emit(this.selectedProjectMilestone);
    this.dialogRef.hide();
  }

  public onBtnCancelClick(): void {
    this.dialogRef.hide();
  }

  public searchData(): void {
    this.request.pageIndex = 0;
    this.initData();
  }

  public onModelChangeInput(data: any) {
    this.onChange(data);
    this.change.emit(data);
  }

}
