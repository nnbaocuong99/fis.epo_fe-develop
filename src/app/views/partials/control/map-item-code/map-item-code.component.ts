import { ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationService } from '../../../../services/common/notification/notification.service';
import { DialogRef } from '../../content/crud/dialog/dialog-ref.model';
import * as config from './map-item-code.config';
import * as mainConfig from '../../../../core/_config/main.config';
import { ItemService } from '../../../../services/modules/category/item/item.service';
import { MatPaginator } from '@angular/material/paginator';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { BaseFormComponent } from '../../../../core/_base/component/base-form.component';
import { ItemRequestPayload } from '../../../../services/modules/category/item/item.request.payload';
import { BaseListComponent } from '../../../../core/_base/component/base-list.component';
import { tap } from 'rxjs/internal/operators/tap';
import { merge } from 'rxjs/internal/observable/merge';

@Component({
  selector: 'app-map-item-code',
  templateUrl: './map-item-code.component.html',
  styleUrls: ['./map-item-code.component.scss']
})

export class MapItemCodeComponent extends BaseListComponent implements OnInit {
  @ViewChild('form', { static: true }) form: NgForm;

  public header = config.HEADER;
  public mainConfig = mainConfig.MAIN_CONFIG;
  public request = new ItemRequestPayload();
  public formTitle = 'ITEM.HEADER_LIST';
  public dataSource = {
    items: null,
    paginatorTotal: undefined
  };
  public itemRequestPayload = new ItemRequestPayload();

  public dialogRef: DialogRef = new DialogRef();
  @Input() placeholder: string;
  @Output() change: EventEmitter<any> = new EventEmitter();

  public listItem: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService,
    public itemService: ItemService) {
    super();
  }

  ngOnInit() {
  }

  public onBtnShowDialogListClick(): void {
    this.cdr.detectChanges();
    this.dialogRef.show();
  }

  public close() {
    this.dialogRef.hide();
  }

  public onBtnSaveClick(): void {
    this.change.emit(this.dataSource.items);
    this.dialogRef.hide();
  }

  public onBtnCancelClick(): void {
    this.dialogRef.hide();
  }

  public onModelChangeItemCode(itemDto: any, rowData: any) {
    if (itemDto && !(typeof itemDto === 'object')) {
      if (itemDto.itemId) {
        rowData.itemId = itemDto.itemId;
      }
      if (itemDto.code) {
        rowData.itemCode = itemDto.code;
      }
      if (itemDto.name) {
        rowData.itemName = itemDto.name;
      }
      if (itemDto.unitCode) {
        rowData.unit = itemDto.unitCode;
      }
      if (itemDto.inventoryItemFlag === 'Y') {
        rowData.itemType = 'HW';
      }
    }
  }
}
