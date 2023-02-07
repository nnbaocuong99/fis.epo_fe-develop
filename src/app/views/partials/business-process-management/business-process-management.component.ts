import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Guid } from 'guid-typescript';
import { forkJoin } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { BpmService } from '../../../services/modules/s-pro/bpm.service';
import { UserService } from '../../../services/modules/user/user.service';
import { CustomConfirmation } from '../../../services/common/confirmation/custom-confirmation';
import { Store } from '@ngrx/store';
import { AppState } from '../../../core/reducers';
import { currentUser } from '../../../core/auth';
import * as mainConfig from '../../../core/_config/main.config';
import { NotificationService } from '../../../services/common/notification/notification.service';
import { MappingSproService } from '../../../services/modules/mapping-spro/mapping-spro.service';
import { NgForm } from '@angular/forms';
import { BaseFormComponent } from '../../../core/_base/component/base-form.component';
import { replaceAll } from 'chartist';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FileService } from '../../../services/modules/file/file.service';
import { TranslateService } from '@ngx-translate/core';
import * as _moment from 'moment';

@Component({
  selector: 'business-process-management',
  templateUrl: './business-process-management.component.html',
  styleUrls: ['./business-process-management.component.scss']
})

export class BusinessProcessManagementComponent extends BaseFormComponent implements OnInit {
  @ViewChild('formTicket', { static: true }) formTicket: NgForm;

  @Input() titleOptionProcess: string;
  @Input() module: string;
  @Input() objectData: any = {};
  @Input() items = [];
  @Input() isTreeItems = true;
  @Input() file: any = {};

  @Output() createTicketSuccess: EventEmitter<any> = new EventEmitter();
  @Output() cancelTicketSuccess: EventEmitter<any> = new EventEmitter();
  @Output() changeCombobox: EventEmitter<any> = new EventEmitter();
  @Output() changeProcess: EventEmitter<any> = new EventEmitter();

  public urlOriginBaOnline = 'https://testba.xplat.fpt.com.vn';

  public controlId: any = Guid.create().toString();
  public displays = [];
  public relatives = [];
  public relationships = [];
  public ticketTemplate: any = {};
  public processTicketData: any = {};
  private mappingField = [];
  private mappingFieldItem = [];
  public isShowTicketDetail = false;
  public rating = 5;
  public currentRelative: any;
  public ticketInfo: any = {};
  public ticketDetails: any = {};
  public reason: string;
  public implementer: any;
  public mainConfig: any = mainConfig.MAIN_CONFIG;
  public sites: any = mainConfig.SITES;
  public phaseInfor: any;
  public phaseOutput: any = [];
  public phaseInput: any = [];
  public step: number;
  public isShowCreateTicketTemplate = false;
  public isShowPhaseInformation = true;
  public isShowPhaseInputInformation = true;
  public isShowPhaseOutputInformation = true;
  public isShowPhaseCancel = true;
  public isShowTicketInformation = true;
  public userInform = {
    userDto: null,
    value: null
  };
  public requestSubject: string;
  public site: number;
  private relativeBindings = [];

  public sproIdAttach: number;
  public listAttachments = [];

  constructor(
    public bpmService: BpmService,
    public mappingSproService: MappingSproService,
    public cdr: ChangeDetectorRef,
    public notification: NotificationService,
    public userService: UserService,
    public store: Store<AppState>,
    public http: HttpClient,
    public fileService: FileService,
    public translate: TranslateService) {
    super();
  }

  ngOnInit() {
    this.initData();
  }

  public goToLink(url: string) {
    window.open(url, '_blank');
  }

  public initData(isAprrove?: boolean): void {
    if (!this.objectData.sproTicketId) {
      return;
    }
    const ticketSub = forkJoin([
      this.bpmService.getTicketProcess(this.objectData.sproTicketId),
      this.bpmService.getTicket(this.objectData.sproTicketId),
      this.store.select(currentUser).pipe(take(1))
    ]).subscribe(results => {
      if (results[0].resultCode === 200) {
        this.relatives = results[0].data.relatives;
        this.relationships = results[0].data.relationships;
        const currentUserName = results[2].userName;

        // remove relationship not display
        this.relationships.forEach((element, i) => {
          if (element.display) {
            this.relationships.splice(i, 1);
          }
        });
        this.relativeBindings = [];
        this.relativeBindings.push(this.relatives.find(x => x.id === this.relationships[0].from));
        this.getRelative(this.relationships, currentUserName);

        this.relatives = this.relativeBindings;
        this.relatives.sort((a, b) => b.id - a.id);

        this.relationships = this.relationships.filter(x => this.relatives.find(m => m.id === x.from)
          && this.relatives.find(m => m.id === x.to));
        if (results[1].resultCode === 200) {
          this.ticketInfo = results[1].ticketInfos;
          this.ticketDetails = results[1].ticketDetails;
          this.rating = this.ticketInfo.rating;
        }

        this.cdr.detectChanges();
      }

    });
    this.subscriptions.push(ticketSub);
  }

  private getRelative(relationships: any, currentUserName: string): void {
    const latestId = this.relativeBindings[this.relativeBindings.length - 1].id;
    const arr = relationships.filter(x => x.from === latestId);
    const arrRelative = this.relatives.filter(x => arr.find(m => m.to === x.id));
    const item = arrRelative.find(x => (x.roles.implementer.includes(currentUserName) || x.owner === currentUserName)
      && x.status !== 'Finished');
    if (item) {
      item.summary = arrRelative.map(x => x.summary).join(' & ');
      this.relativeBindings.push(item);
    } else {
      if (arrRelative[0]) {
        arrRelative[0].summary = arrRelative.map(x => x.summary).join(' & ');
        this.relativeBindings.push(arrRelative[0]);
      }
    }
    const arrNew = [];
    relationships.forEach(element => {
      if (arr.find(x => x.id !== element.id)) {
        arrNew.push(element);
      }
    });
    if (arrNew.length > 0) {
      this.getRelative(arrNew, currentUserName);
    }
  }

  public onStepClick(item, i): void {
    this.bpmService.getPhaseDetail(item.itemId).subscribe(res => {
      this.step = i;
      this.expandInformation();
      if (this.phaseOutput[0] && this.phaseOutput[0].detail && this.phaseOutput[0].detail.individual.length > 0) {
        this.phaseOutput[0].detail.individual.map(x => x.value = '');
      }
      this.currentRelative = item;
      if (res.resultCode === 200) {
        this.phaseInfor = res.phaseInfos;
        this.phaseOutput = res.phaseOutput;
        this.phaseInput = res.phaseInput;
        this.isShowTicketDetail = true;
      } else {
        this.notification.showWarning(res.message);
      }
      this.cdr.detectChanges();
    });
  }

  private expandInformation() {
    this.isShowPhaseInformation = true;
    this.isShowPhaseInputInformation = true;
    this.isShowPhaseOutputInformation = true;
    this.isShowPhaseCancel = true;
  }

  private hideActionDialog() {
    this.isShowTicketDetail = false;
    this.reason = '';
  }

  public onBtnCancelTicketClick(): void {
    const request = {
      id: this.objectData.sproTicketId,
      reason: this.reason
    };
    const confirmation = new CustomConfirmation('COMMON_MSG.SPRO_CONFIRM_CANCEL');
    confirmation.accept = () => {
      const cancelSub = this.bpmService.cancel(request).subscribe(res => {
        if (res.resultCode === 200) {
          this.hideActionDialog();
          this.initData();
          this.cancelTicketSuccess.emit();
        }
      });
      this.subscriptions.push(cancelSub);
    };
    this.notification.confirm(confirmation);
  }

  public onBtnApproveClick(): void {
    const request = {
      phaseOutputId: this.phaseOutput[0].id,
      detail: this.phaseOutput[0].detail
    };
    const confirmation = new CustomConfirmation('COMMON_MSG.SPRO_CONFIRM_APPROVE');
    confirmation.accept = () => {
      const approveSub = this.bpmService.approve(request).subscribe(res => {
        if (res.resultCode === 200) {
          this.isShowTicketDetail = false;
          this.initData(true);
        }
        this.notification.showMessage(res.message);
      });
      this.subscriptions.push(approveSub);
    };
    this.notification.confirm(confirmation);
  }

  public onBtnStartClick(): void {
    const request = {
      phaseOutputId: this.phaseOutput[0].id,
    };
    const confirmation = new CustomConfirmation('COMMON_MSG.SPRO_CONFIRM_START');
    confirmation.accept = () => {
      const startSub = this.bpmService.start(request).subscribe(res => {
        if (res.resultCode === 200) {
          this.isShowTicketDetail = false;
          this.onStepClick(this.currentRelative, this.step);
        }
        this.notification.showMessage(res.message);
      });
      this.subscriptions.push(startSub);
    };
    this.notification.confirm(confirmation);
  }

  public onBtnFinishClick(): void {
    const request = {
      phaseOutputId: this.phaseOutput[0].id,
      detail: this.phaseOutput[0].detail
    };
    const confirmation = new CustomConfirmation('COMMON_MSG.SPRO_CONFIRM_FINISH');
    confirmation.accept = () => {
      const finishSub = this.bpmService.finish(request).subscribe(res => {
        if (res.resultCode === 200) {
          this.isShowTicketDetail = false;
          this.initData();
        }
        this.notification.showMessage(res.message);
      });
      this.subscriptions.push(finishSub);
    };
    this.notification.confirm(confirmation);
  }

  public onBtnChangeImplenterClick(): void {
    const request = {
      phaseId: this.currentRelative.itemId,
      owner: this.implementer ? this.implementer.userName : null,
      comment: this.reason
    };
    const confirmation = new CustomConfirmation('COMMON_MSG.SPRO_CONFIRM_CHANGE_IMPLEMENTER');
    confirmation.accept = () => {
      const finishSub = this.bpmService.changeImplementer(request).subscribe(res => {
        if (res.resultCode === 200) {
          this.onStepClick(this.currentRelative, this.step);
        }
        this.notification.showMessage(res.message);
      });
      this.subscriptions.push(finishSub);
    };
    this.notification.confirm(confirmation);
  }

  public onBtnRequestUpdateClick(): void {
    const request = {
      phaseOutputId: this.phaseOutput[0].id,
      detail: this.phaseOutput[0].detail
    };
    const confirmation = new CustomConfirmation('COMMON_MSG.SPRO_CONFIRM_REQUEST_UPDATE');
    confirmation.accept = () => {
      const finishSub = this.bpmService.requestUpdateOutput(request).subscribe(res => {
        if (res.resultCode === 200) {
          this.hideActionDialog();
          this.initData();
        }
        this.notification.showMessage(res.message);
      });
      this.subscriptions.push(finishSub);
    };
    this.notification.confirm(confirmation);
  }

  public onRate(event: any): void {
    const request = {
      phaseId: this.currentRelative.itemId,
      note: '',
      rating: event.value
    };
    const confirmation = new CustomConfirmation('COMMON_MSG.SPRO_CONFIRM_RATE');
    confirmation.accept = () => {
      const confirmCloseSub = this.bpmService.confirmClose(request).subscribe(res => {
        if (res.resultCode === 200) {
          this.isShowTicketDetail = false;
          this.initData();
        }
        this.notification.showMessage(res.message);
      });
      this.subscriptions.push(confirmCloseSub);
    };
    this.notification.confirm(confirmation);
  }

  public onFilesInputChanged(files: File[], item: any, type: string) {
    if (files[0]) {
      if (type === 'Comment') {
        const reader = new FileReader();
        const file = files[0];
        reader.readAsDataURL(file);
        reader.onload = () => {
          const request = {
            objectType: type,
            fileInfo: [{
              size: file.size,
              fileName: file.name,
              contentType: file.type,
              content: reader.result.toString().split(',')[1]
            }]
          };
          this.bpmService.upload(request).subscribe(res => {
            if (res && res.fileInfo) {
              if (item) {
                item.value = res.fileInfo[0].fileId;
              }
            }
          });
        };
      }

      if (type === 'Ticket' && item.id) {
        const attachments = {
          controlId: item.id,
          objectType: type,
          fileInfo: []
        };
        for (let i = 0; i < files.length; i++) {
          const reader = new FileReader();
          const file = files[i];
          reader.readAsDataURL(file);
          reader.onload = () => {
            attachments.fileInfo.push({
              size: file.size,
              fileName: file.name,
              contentType: file.type,
              content: reader.result.toString().split(',')[1]
            });
            if (i === files.length - 1) {
              this.listAttachments = this.listAttachments.filter(m => m.controlId !== item.id);
              this.listAttachments.push(attachments);
            }
          };
        }
      }
    }
  }

  public onShowDialogCreateTicket(): void {
    if (this.module === 'PURCHASE_PLAN') {
      this.requestSubject = 'EPO - Phê duyệt kế hoạch mua hàng: ' + this.objectData.code;
    }
    if (this.module === 'PURCHASE_REQUEST') {
      this.requestSubject = 'EPO - Phê duyệt yêu cầu mua hàng: ' + this.objectData.prNo;
    }
    if (this.module === 'PURCHASE_ORDER') {
      this.requestSubject = 'EPO - Phê duyệt đơn hàng: ' + this.objectData.code;
    }
    const requestMappingSpro: any = {
      module: this.module
    };
    this.mappingSproService.select(requestMappingSpro).subscribe(rsMapping => {
      if (!rsMapping || rsMapping.length === 0) {
        this.notification.showWarning('Vui lòng cấu hình mapping process!');
        this.isShowCreateTicketTemplate = false;
        this.cdr.detectChanges();
        return;
      } else if (rsMapping.length === 1) {
        this.onChangeProcess(rsMapping[0]);
      }
      this.isShowCreateTicketTemplate = true;
    });
  }

  public getProcess(processId: number): void {
    if (processId) {
      this.sproIdAttach = null;
      this.bpmService.getProcess(processId).subscribe(res => {
        this.ticketTemplate = res.data.ticket_template;
        this.createListItem();
        this.processTicketData = res.data;
        this.processTicketData.processNameDto = { processName: this.processTicketData.processName };

        for (const element of this.mappingField) {
          const temp = this.ticketTemplate.individual.find(x => x.id === element.sproId);
          if (temp && element.epoField) {
            const index = this.ticketTemplate.individual.indexOf(temp);
            if (temp.type === 'upload' && !this.sproIdAttach && this.file && this.file.name) {
              this.ticketTemplate.individual[index].fileName = this.file.name; // điền tên file vào để hiển thị
              // tslint:disable-next-line:radix
              this.sproIdAttach = parseInt(element.epoField);
            // tslint:disable-next-line:max-line-length
            } else if (temp.type === 'link' && element.epoField && element.link && this.objectData[`${this.toCamelCase(element.epoField)}`]) {
              this.ticketTemplate.individual[index].value = element.link + this.objectData[`${this.toCamelCase(element.epoField)}`];
            } else {
              this.ticketTemplate.individual[index].value = this.objectData[`${this.toCamelCase(element.epoField)}`];
            }
            if (this.ticketTemplate.individual[index].value === undefined) {
              // tslint:disable-next-line:max-line-length
              this.ticketTemplate.individual[index].value = ''; // 1 số trường nếu undefined thì qua BA Online nó là chữ null nên gán là rỗng
            }
          }
        }

        if (this.module === 'PURCHASE_REQUEST' && this.objectData.ppSproUserProcess) {
          const temp = this.ticketTemplate.individual.find(x => x.controlType === 'picker' && x.name === 'BP Process');
          if (temp) {
            const index = this.ticketTemplate.individual.indexOf(temp);
            // gán BP Process khi người dùng thay đổi thông tin ticket của KHMH bên BA Online vào BP Process của ticket YCMH
            this.ticketTemplate.individual[index].value = this.objectData.ppSproUserProcess.trim().toLocaleLowerCase();
          }
        }

        // Sort order các trường theo position
        this.ticketTemplate.individual.sort((a, b) => a.position - b.position);

        // Xử lý hiển thị item theo displayCondition
        for (const element of this.ticketTemplate.individual) {
          if (element.conditions && element.conditions.displayCondition) {
            const item = this.ticketTemplate.individual.find(x => x.id === element.conditions.displayCondition.idCondition);
            if (item && item.value === element.conditions.displayCondition.valueCondition) {
              element.display = true;
            } else {
              element.display = false;
            }
          }
        }

        // chỉ lấy những trường được tích push bên mapping spro
        const listSproIdPush: any[] = this.mappingField.filter(m => m.push).map(m => m.sproId);
        for (const item of this.ticketTemplate.individual) {
          if (!listSproIdPush.includes(item.id)) {
            item.display = false;
          }
        }

        this.cdr.detectChanges();
      });
    } else {
      this.ticketTemplate = {};
      this.processTicketData = {};
    }
  }

  public onChangeProcess(event: any): void {
    if (event && event.id) {
      this.mappingField = event.mappingField ? JSON.parse(event.mappingField) : [];
      this.mappingFieldItem = event.mappingFieldItem ? JSON.parse(event.mappingFieldItem) : [];
      this.getProcess(event.processId);
    } else {
      this.mappingField = [];
      this.mappingFieldItem = [];
      this.getProcess(null);
    }
    this.changeProcess.emit(null);
  }

  public getListNotTree(): any {
    // trải phẳng dữ liệu
    const arrItemSave = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      arrItemSave.push(item.data);
      if (item.children && item.children.length > 0) {
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < item.children.length; j++) {
          const children = item.children[j];
          arrItemSave.push(children.data);
        }
      }
    }
    return arrItemSave;
  }

  public createListItem() {
    if (this.ticketTemplate.table) {
      this.ticketTemplate.table.values = [];
      const list = this.isTreeItems ? this.getListNotTree() : this.items;
      let genId = 0;
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        const obj = JSON.parse(JSON.stringify(this.ticketTemplate.table.columns));
        for (const column of obj) {
          const temp = this.mappingFieldItem.find(m => m.sproId === column.id);
          // tslint:disable-next-line:max-line-length
          if (temp && temp.epoField && (item[`${this.toCamelCase(temp.epoField)}`] !== null && item[`${this.toCamelCase(temp.epoField)}`] !== undefined)) {
            column.value = item[`${this.toCamelCase(temp.epoField)}`];
            if (column.type === 'date') {
              column.value = _moment(new Date(column.value), 'yyyy-MM-dd').format('DD/MM/YYYY');
            }
          }
          // tạo position, columnId, id (id không được trùng và nhỏ hơn 0)
          column.position = i + 1;
          column.columnId = column.id;
          column.id = --genId;
          this.ticketTemplate.table.values.push(column);
        }
      }
    }
  }

  public onBtnSubmitTicketClick(): void {
    if (!this.validateForm(this.formTicket, 'form-create-ticket')) {
      this.notification.showWarning(this.translate.instant('Vui lòng nhập đủ các thông tin yêu cầu'));
      return;
    }
    if (!this.formTicket.valid) {
      return;
    }

    // Trường hợp checkbox nếu không tích chọn default là null
    for (const element of this.ticketTemplate.individual) {
      if (element.type === 'checkbox' && !element.value) {
        element.value = false;
      }
    }

    const customConfirmation = new CustomConfirmation('Bạn có chắc chắn muốn tạo ticket nháp không?');
    customConfirmation.accept = () => {
      if (this.file && this.file.id && this.sproIdAttach) {
        const selectSub = forkJoin([
          this.fileService.selectById(this.file.id),
          this.fileService.getFileInfo(this.file).pipe(tap(() => {

          }, (err: HttpErrorResponse) => {
            this.notification.showError('File đính kèm hợp đồng mua đã bị xóa hoặc không tồn tại, xin kiểm tra lại');
          }))
        ]).subscribe(
          (response: any[]) => {
            const reader = new FileReader();
            const file = response[1];
            reader.readAsDataURL(file);
            reader.onload = () => {
              const attachments = {
                controlId: this.sproIdAttach,
                objectType: 'Ticket',
                fileInfo: [{
                  size: file.size,
                  fileName: response[0].name,
                  contentType: file.type,
                  content: reader.result.toString().split(',')[1]
                }]
              };
              this.listAttachments = this.listAttachments.filter(m => m.controlId !== this.sproIdAttach);
              this.listAttachments.push(attachments);
              this.onSubmit();
            };
          });
        this.subscriptions.push(selectSub);
      } else {
        this.onSubmit();
      }
    };
    this.notification.confirm(customConfirmation);
  }

  private onSubmit() {
    const request = {
      objectId: this.objectData.id,
      objectType: this.module,
      title: this.requestSubject,
      locationId: this.site ? this.site : 1,
      ticketId: this.objectData.sproTicketId ? this.objectData.sproTicketId : 0,
      informedUsers: this.userInform.value,
      derivedTicketId: 0,
      detail: this.ticketTemplate,
      processId: this.processTicketData.processId,
      listAttachments: this.listAttachments
    };
    this.bpmService.createDraft(request).subscribe(res => {
      if (res.key) {
        this.createTicketSuccess.emit(res.key);
        this.isShowCreateTicketTemplate = false;
        this.notification.showMessage('Create draft ticket successfully');
        this.goToLink(`${this.urlOriginBaOnline}/secure/UseDraft.jspa?draftId=${res.key}`);
      }
    });
  }

  public onCloseDialogCreateTicket(): void {
    this.isShowCreateTicketTemplate = false;
  }

  public onChangeCombobox(item: any) {
    this.setItemDisplay(item);
    if (item.mdConfig && item.mdConfig.children && item.mdConfig.children.length > 0) {
      const params = this.ticketTemplate.individual.filter(x => item.mdConfig.children.map(m => m.id).includes(x.id));
      params.map(x => x.mdConfig.parents.map(m => m.value = item.value));

      for (const element of params) {
        const request = {
          type: element.type,
          mdConfig: element.mdConfig
        };
        this.bpmService.getComboboxData(request).subscribe(res => {
          if (res && res.length > 0) {
            const index = this.ticketTemplate.individual.findIndex(x => x.id === element.id);
            if (index > -1) {
              this.ticketTemplate.individual[index].value = res[0].text;
              this.ticketTemplate.individual[index].masterDto = {
                text: res[0].text
              };
              this.ticketTemplate.individual[index].requestPayload = request;
              this.onChangeCombobox(this.ticketTemplate.individual[index]);
              this.cdr.detectChanges();
            }
          }
        });
      }
    }
    this.changeCombobox.emit(item);
  }

  // function check từ baonline
  private checkConditionFromBaOnline(conditions, individual): boolean {
    let result = false;
    const operation = conditions.operation;
    if ('else' === operation) {
      return true;
    } else if (('and' === operation || 'or' === operation) && conditions.items !== undefined) {
      const items = conditions.items;
      let checkTmp = null;
      for (const item of items) {
        if (checkTmp == null) {
          checkTmp = this.checkConditionFromBaOnline(item, individual);
        } else {
          if ('and' === operation) {
            checkTmp = checkTmp &&
              this.checkConditionFromBaOnline(item, individual);
          } else if ('or' === operation) {
            checkTmp = checkTmp ||
              this.checkConditionFromBaOnline(item, individual);
          }
        }
      }
      if (checkTmp != null) {
        result = checkTmp;
      }
    } else {
      const compareType = conditions.compareType;
      const leftElement = conditions.leftElement;
      const rightElement = conditions.rightElement;
      if (!compareType || !leftElement || !rightElement) {
        return true;
      }
      leftElement.name = 'leftElement';
      rightElement.name = 'rightElement';
      const lstElements = new Array();
      lstElements.push(leftElement);
      lstElements.push(rightElement);

      const leftValue = individual[individual.findIndex(x => x.id === leftElement.infoId)].value;
      const rightValue = rightElement.value;
      if ('number' === compareType) {
        const floatLeftVal = leftValue ? leftValue : null;
        const floatRightVal = parseFloat(replaceAll(rightValue, ',', '').trim());
        if (operation === 'equal') {
          if (floatLeftVal === floatRightVal) {
            return true;
          }
        } else if (operation === 'notEqual') {
          if (floatLeftVal !== floatRightVal) {
            return true;
          }
        } else if (operation === 'greaterOrEqual') {
          if (floatLeftVal >= floatRightVal) {
            return true;
          }
        } else if (operation === 'lessOrEqual') {
          if (floatLeftVal <= floatRightVal) {
            return true;
          }
        } else if (operation === 'less') {
          if (floatLeftVal < floatRightVal) {
            return true;
          }
        } else if (operation === 'greater') {
          if (floatLeftVal > floatRightVal) {
            return true;
          }
        }
      } else if ('text' === compareType) {
        if (operation === 'equal') {
          if (leftValue && rightValue && leftValue.toString().toLowerCase().trim() === rightValue.toString().toLowerCase().trim()) {
            return true;
          }
        } else if (operation === 'notEqual') {
          if (leftValue && rightValue && leftValue.toString().toLowerCase().trim() !== rightValue.toString().toLowerCase().trim()) {
            return true;
          }
        }
      }
    }

    return result;
  }

  public onModelChangeItem(item): void {
    // NGười duyệt không xử lý
    if (item.id !== -800) {
      this.ticketTemplate.individual.forEach(element => {
        if (element.dataFromFunc === 'feederData') {
          for (const dataFromCondition of element.dataFromCondition) {
            if (this.checkConditionFromBaOnline(dataFromCondition.conditions, this.ticketTemplate.individual)) {
              element.value = dataFromCondition.value.value;
              this.setItemDisplay(element);
              break;
            }
          }
        }
        if (element.expressionConfig) {
          const arrCheck = [];
          for (const operand of element.expressionConfig.operands) {
            const index = this.ticketTemplate.individual.findIndex(x => x.id === operand['data-config'].infoId);
            if (index > -1) {
              arrCheck.push(+this.ticketTemplate.individual[index].value);
            }
          }
          if (element.expressionConfig.operator === 'MAX') {
            element.value = Math.max(...arrCheck).toString();
          }
        }
      });
    }

    this.setItemDisplay(item);
  }

  // Xử lý ẩn hiển item
  private setItemDisplay(item): void {
    if (item.displayConfig && item.displayConfig.children && item.displayConfig.children.length > 0) {
      for (const element of item.displayConfig.children) {
        const itemCondition = this.ticketTemplate.individual.find(x => x.id === element.displayCondition.idCondition);
        if (itemCondition.value && element.displayCondition.valueCondition.includes(itemCondition.value)) {
          this.ticketTemplate.individual.find(x => x.id === element.childId).display = true;
        } else {
          this.ticketTemplate.individual.find(x => x.id === element.childId).display = false;
        }
        this.cdr.detectChanges();
      }
    }
  }

  public getFileNameFromUrl(strUrl) {
    if (strUrl) {
      const arr = decodeURI(strUrl).split('/');
      return arr[arr.length - 1];
    }
  }

  public getClassDisplay(item: any): string {
    if (item.display === false) {
      return 'hide';
    } else {
      return item.type === 'splitter' ? 'full-width' : 'col-md-6 mb-3';
    }
  }

  public onChangeUserInform(data) {
    if (this.userInform.userDto) {
      const listUserName = this.userInform.userDto.map(({ userName }) => userName);
      this.userInform.value = listUserName.join(',');
    }
  }

}
