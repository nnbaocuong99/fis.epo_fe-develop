import { ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseComponent } from '../../../../../../core/_base/component/base-component';
import { BranchRequestPayload } from '../../../../../../services/modules/branch/branch.request-payload';
import { BranchService } from '../../../../../../services/modules/branch/branch.service';
import { DialogRef } from '../../../../../partials/content/crud/dialog/dialog-ref.model';
import * as config from './user-branch.config';
import * as mainConfig from '../../../../../../core/_config/main.config';
import { NotificationService } from '../../../../../../services/common/notification/notification.service';

export const USER_BRANCH_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => UserBranchComponent),
  multi: true
};

@Component({
  selector: 'app-user-branch',
  templateUrl: './user-branch.component.html',
  styleUrls: ['./user-branch.component.scss'],
  providers: [USER_BRANCH_CONTROL_VALUE_ACCESSOR]
})
export class UserBranchComponent extends BaseComponent implements OnInit {
  @Output() change: EventEmitter<any> = new EventEmitter();
  @Input() placeholder: string;
  @Input() disabled = false;
  @Input() required = false;

  public header = config.HEADER;
  public mainConfig = mainConfig.MAIN_CONFIG;
  public request = new BranchRequestPayload();

  public selectedItems = [];
  public isPristine = true;

  public dialogRef: DialogRef = new DialogRef();

  public dataSource = {
    items: null,
    paginatorTotal: undefined
  };

  constructor(
    public cdr: ChangeDetectorRef,
    public notificationService: NotificationService,
    public branchService: BranchService) {
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

  }

  initData(userBranch) {
    this.selectedItems = userBranch;
    const sub = this.branchService.select(this.request).subscribe(m => {
      this.dataSource.items = m;
      for (let i = 0; i < this.dataSource.items.length; i++) {
        for (let j = 0; j < this.selectedItems.length; j++) {
          if (this.dataSource.items[i].code === this.selectedItems[j].code) {
            this.dataSource.items[i].main = this.selectedItems[j].main;
          }
        }
      }
      this.cdr.detectChanges();
    });
    this.subscriptions.push(sub);
  }

  public close() {
    this.dialogRef.hide();
  }

  public onModelChangeInput(data: any) {
    this.onChange(data);
    this.change.emit(data);
    if (!this.value) {
      this.selectedItems.map(m => {
        m.main = null;
        return m;
      });
      this.selectedItems = [];
      this.isPristine = false;
    }
  }

  public onBtnShowDialogListClick(): void {
    this.cdr.detectChanges();
    this.dialogRef.show();
  }

  public onBtnChooseClick(): void {
    if (this.selectedItems.length > 0) {
      const check = this.selectedItems.some(m => m.main === true);
      if (!check) {
        this.notificationService.showWarning('Chưa chọn chi nhánh chính');
        return;
      }
      const listBranch = this.selectedItems.map(m => m.code);
      this.value = listBranch.join(', ');
      this.onChange(this.value);
      this.change.emit(this.selectedItems);
      this.isPristine = false;
      this.dialogRef.hide();
    }
  }

  public checkDisabledMain(rowData) {
    return this.selectedItems.some(m => m.code === rowData.code);
  }

  public onRowUnselect(event) {
    event.data.main = null;
  }

  public changeMain(event: any, rowData: any) {
    for (let i = 0; i < this.selectedItems.length; i++) {
      if (this.selectedItems[i].code === rowData.code) {
        this.selectedItems[i].main = event.checked ? true : null;
      }
    }
  }
}
