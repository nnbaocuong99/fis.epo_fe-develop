import { ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild, ViewRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { TreeNode } from 'primeng/api';
import { Tree } from 'primeng/tree';
import { BaseComponent } from '../../../../../../core/_base/component/base-component';
import { OrgChartService } from '../../../../../../services/modules/org-chart/org-chart.service';
import { DialogRef } from '../../../../../partials/content/crud/dialog/dialog-ref.model';

export const USER_ORG_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => UserOrgComponent),
  multi: true
};

@Component({
  selector: 'app-user-org',
  templateUrl: './user-org.component.html',
  styleUrls: ['./user-org.component.scss'],
  providers: [USER_ORG_CONTROL_VALUE_ACCESSOR]
})
export class UserOrgComponent extends BaseComponent implements OnInit {
  @Output() change: EventEmitter<any> = new EventEmitter();
  @Output() afterTreeInit: EventEmitter<any> = new EventEmitter();
  @ViewChild('tree', { static: true }) tree: Tree;

  @Input() choose = false;
  @Input() placeholder: string;
  @Input() disabled = false;
  @Input() required = false;

  public selectedOrgs = [];
  public isPristine = true;
  public dialogRef: DialogRef = new DialogRef();

  constructor(
    public orgChartService: OrgChartService,
    public cdr: ChangeDetectorRef) {
    super();
  }

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
    const getTreeOrgSub = this.orgChartService.getTreeView().subscribe(() => {
      this.cdr.detectChanges();
      setTimeout(() => {
        this.afterTreeInit.emit();
      }, 100);
    });
    this.subscriptions.push(getTreeOrgSub);
  }

  public onSelectionChange(event: any): void {
    this.change.emit(event);
    this.isPristine = false;
  }

  public close() {
    this.dialogRef.hide();
  }

  public onModelChangeInput(data: any) {
    this.onChange(data);
    this.change.emit(data);
    if (!data) {
      this.selectedOrgs = [];
    }
  }

  public onBtnShowDialogListClick(): void {
    this.dialogRef.show();
    this.cdr.detectChanges();
  }

  public onBtnChooseClick(): void {
    const listGroupId = this.selectedOrgs.map(({ data }) => data.id);
    this.value = listGroupId;
    this.onChange(this.value);
    this.dialogRef.hide();
  }

}
