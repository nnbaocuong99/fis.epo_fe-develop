import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { forkJoin } from 'rxjs';
import { BaseComponent } from '../../../../../../core/_base/component/base-component';
import { SaveConfirmation } from '../../../../../../services/common/confirmation';
import { NotificationService } from '../../../../../../services/common/notification/notification.service';
import { AfGroupService } from '../../../../../../services/modules/af-group/af-group.service';
import { BrandRequestPayload } from '../../../../../../services/modules/category/brand/brand.request.payload';
import { BrandService } from '../../../../../../services/modules/category/brand/brand.service';
import { ConfigListRequestPayload } from '../../../../../../services/modules/config-list/config-list.request.payload';
import { ConfigListService } from '../../../../../../services/modules/config-list/config-list.service';
import { UserRequestPayload } from '../../../../../../services/modules/user/user-request.payload';
import { UserService } from '../../../../../../services/modules/user/user.service';
import { DialogRef } from '../../../../../partials/content/crud/dialog/dialog-ref.model';

@Component({
  selector: 'app-user-producer',
  templateUrl: './user-producer.component.html',
  styleUrls: ['./user-producer.component.scss']
})
export class UserProducerComponent extends BaseComponent implements OnInit {
  @Output() change: EventEmitter<any> = new EventEmitter();
  @Input() placeholder: string;
  @Input() disabled = false;
  @Input() required = false;

  @Input() dialogRef: DialogRef;
  @Output() save: EventEmitter<any> = new EventEmitter();
  public dataSource = {
    items: [],
  };
  public selectedItems: any[] = [];
  public isPristine = true;

  public value: any = null;

  constructor(
    public configListService: ConfigListService,
    public afGroupService: AfGroupService,
    public notification: NotificationService,
    public userService: UserService,
    public brandService: BrandService,
    public cd: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    // this.dialogRef.visibility$.subscribe(isDisplay => {
    //   if (isDisplay) {
    if (!this.dialogRef.input.userId) {
      this.requestSaveAfterConfig();
      this.dialogRef.hide();
      this.cd.detectChanges();
      return;
    }

    const userRequest = new UserRequestPayload();
    userRequest.id = this.dialogRef.input.userId;
    userRequest.subRoleType = 'PRODUCER_USER';

    const requestBrand = new BrandRequestPayload();
    requestBrand.haspaging = false;

    const observables = [
      this.brandService.select(requestBrand),
      this.userService.selectSubRoleUser(userRequest)
    ];

    const subs = forkJoin(observables).subscribe(res => {
      this.dataSource.items = res[0];
      this.selectedItems = this.dataSource.items.filter(x => res[1].some(y => y.subRoleValue === x.id));
      const list = this.selectedItems.map(m => m.code);
      this.value = list.join(', ');
      this.cd.detectChanges();
    });

    this.subscriptions.push(subs);
    //   }
    // });
  }

  public onFunctionClick(): void {
    this.dialogRef.show();
  }

  public onBtnCancelClick(): void {
    this.dialogRef.hide();
  }

  public onBtnChooseClick(): void {
    if (this.selectedItems) {
      const list = this.selectedItems.map(m => m.code);
      this.value = list.join(', ');
      this.change.emit(this.selectedItems);
      this.isPristine = false;
      this.dialogRef.hide();
    }
  }

  public onBtnUnselectAllClick(): void {
    this.selectedItems = [];
  }

  public requestSaveAfterConfig(): void {
    const confirmation = new SaveConfirmation();
    confirmation.message = 'Bạn phải thực hiện lưu trước khi cấu hình nâng cao. Bạn có muốn?';
    confirmation.accept = () => {
      this.save.emit();
    };

    this.notification.confirm(confirmation);
  }

  public onModelChangeInput(data: any) {
    if (!this.value) {
      this.selectedItems = [];
      this.isPristine = false;
    }
  }
}
