
import { TreeNode } from 'primeng/api/treenode';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActionService } from '../../../../../../services/modules/action/action.service';
import { DialogRef } from '../../../../../partials/content/crud/dialog/dialog-ref.model';
import { BusinessTaskService } from '../../../../../../services/modules/business-task/business-task.service';
import { BusinessTaskRequestPayload } from '../../../../../../services/modules/business-task/business-task.request.payload';
@Component({
  selector: 'app-customize-resource',
  templateUrl: './customize-resource.component.html',
  styleUrls: ['./customize-resource.component.scss']
})
export class CustomizeResourceComponent implements OnInit {
  @Input() dialogRef: DialogRef;
  @Input() node: any;
  @Output() performSet: EventEmitter<any> = new EventEmitter();

  public dataSouce = {
    items: [],
    selectedItems: []
  };

  public listRestricted: any[] = [];

  constructor(
    public actionService: ActionService,
    public businessTaskService: BusinessTaskService,
    public cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.dialogRef.visibility$.subscribe(isDisplay => {
      if (isDisplay) {
        const requestPayload = new BusinessTaskRequestPayload();
        requestPayload.operationId = this.dialogRef.input.operationId;
        this.businessTaskService.selectOperationBusinessTask(requestPayload).subscribe(res => {
          this.dataSouce.items = res;

          const request = {
            roleId: this.dialogRef.input.roleId,
            operationId: this.dialogRef.input.operationId
          }
          this.actionService.selectResourceRestricted(request).subscribe(restricted => {
            this.listRestricted = restricted;
            this.dataSouce.selectedItems = [...this.dataSouce.items.filter(x => this.listRestricted.some(y => y.resourceId === x.id))];
            this.cd.detectChanges();
          });

          this.cd.detectChanges();
        });
      } else {
        this.listRestricted = [];
      }
    });
  }

  public initDefaultValue(): void {
    this.dataSouce = {
      items: [],
      selectedItems: []
    };
    this.listRestricted = [];
  }

  public checkHaveParent(event: any): boolean {
    if (event.parent) {
      return true;
    }
    return false;
  }

  public onBtnSetClick(): void {
    const request = {
      roleId: this.dialogRef.input.roleId,
      operationId: this.dialogRef.input.operationId,
      resourceRestricted: this.listRestricted
    };
    this.actionService.mergeResourceRestricted(request).subscribe(() => {
      this.performSet.emit();
      this.dialogRef.hide();
    });
  }

  public onBtnCancel(): void {
    this.dialogRef.hide();
  }

  public onSelectionChange(event: any, type: number): void {
    if (type === 1) {
      // On select
      const list = this.dataSouce.selectedItems.filter(x => x.actionId === event.data.actionId && x.id !== event.data.id);

      if (list.length > 0) {
        for (let item of list) {
          const index = this.dataSouce.selectedItems.findIndex(x => x.id === item.id);
          this.dataSouce.selectedItems.splice(index, 1);
        }

        setTimeout(() => {
          this.dataSouce.selectedItems = [...this.dataSouce.selectedItems];
          this.cd.detectChanges();
        }, 0);
      }
    } else if (type === 0) {
      // On unselect
    }

    this.listRestricted = this.dataSouce.items.filter(x => this.dataSouce.selectedItems.some(y => x.id === y.id)).map(x => {
      return {
        roleId: this.dialogRef.input.roleId,
        operationId: this.dialogRef.input.operationId,
        resourceId: x.id
      }
    });;
  }
}
