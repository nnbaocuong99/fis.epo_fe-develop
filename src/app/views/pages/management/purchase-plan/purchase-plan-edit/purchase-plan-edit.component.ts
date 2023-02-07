import {
    Component,
    OnInit,
    ChangeDetectorRef,
    ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as config from './purchase-plan-edit.config';
import { PurchasePlanService } from '../../../../../services/modules/purchase-plan/purchase-plan.service';
import { NotificationService } from '../../../../../services/common/notification/notification.service';
import * as mainConfig from '../../../../../core/_config/main.config';
import * as parentConfig from '../purchase-plan.config';
import { NgForm } from '@angular/forms';
import { ProjectService } from '../../../../../services/modules/category/project/project.service';
import { ProjectRequestPayload } from '../../../../../services/modules/category/project/project.request.payload';
import { ContractService } from '../../../../../services/modules/contract/contract.service';
import { PurchasePlanItemComponent } from './purchase-plan-item/purchase-plan-item.component';
import { PurchasePlanDto } from '../../../../../services/modules/purchase-plan/purchase-plan.model';
import { UserService } from '../../../../../services/modules/user/user.service';
import { BpmService } from '../../../../../services/modules/s-pro/bpm.service';
import { MappingSproService } from '../../../../../services/modules/mapping-spro/mapping-spro.service';
import { BaseFormComponent } from '../../../../../core/_base/component';
import { SaveConfirmation } from '../../../../../services/common/confirmation/save-confirmation';
import { BusinessProcessManagementComponent } from '../../../../partials/business-process-management/business-process-management.component';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../../core/reducers';
import { currentUser } from '../../../../../core/auth';
import { CurrencyService } from '../../../../../services/modules/category/currency/currency.service';
import { Location } from '@angular/common';
import { CustomerService } from '../../../../../services/modules/category/customer/customer.service';
import { Guid } from 'guid-typescript';
@Component({
    selector: 'app-purchase-plan-edit',
    templateUrl: './purchase-plan-edit.component.html',
    styleUrls: ['./purchase-plan-edit.component.scss'],
})
export class PurchasePlanEditComponent extends BaseFormComponent implements OnInit {
    @ViewChild('form', { static: true }) form: NgForm;
    @ViewChild('purchasePlanItem', { static: false }) purchasePlanItem: PurchasePlanItemComponent;
    @ViewChild('bpm', { static: false }) bpm: BusinessProcessManagementComponent;

    public purchasePlanData: any = {};
    public mainConfig: any = mainConfig.MAIN_CONFIG;
    public cols = config.HEADER;
    public ppStatus = parentConfig.PP_STATUS;
    public headerProject = config.HEADER_PROJECT;
    public headerCustomer = config.HEADER_CUSTOMER;
    public projectRequestPayload = new ProjectRequestPayload();
    public currentPpId: string;
    public file: any;
    public allowViewPrice = false; // check có cả AM và PM thì PM không được xem giá

    private codeDefault = 'xx/xxxxx/xxxxx';

    constructor(
        private route: ActivatedRoute,
        public purchasePlanService: PurchasePlanService,
        public cdr: ChangeDetectorRef,
        private notificationService: NotificationService,
        public projectService: ProjectService,
        private router: Router,
        private contractService: ContractService,
        public userService: UserService,
        public bpmService: BpmService,
        private location: Location,
        public mappingSproService: MappingSproService,
        public currencyService: CurrencyService,
        public customerService: CustomerService,
        private store: Store<AppState>
    ) {
        super();
    }

    public checkRole() {
        this.store.pipe(select(currentUser)).subscribe(obj => {
            if (obj) {
                let userName = obj.userName ? obj.userName.trim().toLocaleLowerCase() : '';
                let amAccount = this.purchasePlanData.amAccount ? this.purchasePlanData.amAccount.trim().toLocaleLowerCase() : '';
                let pmAccount = this.purchasePlanData.pmAccount ? this.purchasePlanData.pmAccount.trim().toLocaleLowerCase() : '';
                if (`,${pmAccount},`.includes(`,${userName},`)) {
                    this.allowViewPrice = false;
                }
                if (`,${amAccount},`.includes(`,${userName},`)) {
                    this.allowViewPrice = true;
                }
                if (obj.roles && obj.roles.length > 0) {
                    if (obj.roles.some(m => m.includes('BP_') || m.includes('XNK_') || m.includes('AF_') || m === 'SUPER_ADMIN')) {
                        this.allowViewPrice = true;
                    }
                }
            }
        });
    }

    ngOnInit() {
        this.initData();
    }

    /**
     * Initialize data
     */
    private initData(): void {
        const routeSub = this.route.params.subscribe((params) => {
            if (params.id) {
                // Case 1: Edit exited item
                this.currentPpId = params.id; // Set current params id
                this.purchasePlanService.selectById(params.id).subscribe(res => {
                    if (!!res) { // When response is not null, load data
                        this.purchasePlanData = new PurchasePlanDto(res);
                        this.purchasePlanData.type = 'update';
                        this.initDataDto();
                        this.checkRole();
                        this.cdr.detectChanges(); // Detect changes on screen
                        setTimeout(() => {
                            this.form.form.markAsPristine();
                        }, 0);
                    } else { // When response is not null, redirect to parent page
                        this.router.navigate([`list`], { relativeTo: this.route.parent });
                    }
                });
            } else {
                // Case 2: Create new item
                this.purchasePlanData = new PurchasePlanDto({
                    code: this.codeDefault
                });
                this.purchasePlanData.id = Guid.create().toString().split('-').join('');
                this.purchasePlanData.type = 'insert';
                this.checkRole();
                this.cdr.detectChanges();
                setTimeout(() => {
                    this.form.form.markAsPristine();
                }, 0);
            }
        });
        this.subscriptions.push(routeSub);
    }

    private initDataDto(): void {
        if (this.purchasePlanData.amAccount) {
            const arrAmAcount = this.purchasePlanData.amAccount.split(',');
            this.purchasePlanData.amAccountDto = [];
            for (const item of arrAmAcount) {
                this.purchasePlanData.amAccountDto.push({ userName: item.trim() });
            }
        }
        if (this.purchasePlanData.pmAccount) {
            const arrPmAcount = this.purchasePlanData.pmAccount.split(',');
            this.purchasePlanData.pmAccountDto = [];
            for (const item of arrPmAcount) {
                this.purchasePlanData.pmAccountDto.push({ userName: item.trim() });
            }
        }

        const arrPeopleInvolved = this.purchasePlanData.peopleInvolved ? this.purchasePlanData.peopleInvolved.split(',') : [];
        this.purchasePlanData.peopleInvolvedDto = [];
        arrPeopleInvolved.forEach(element => {
            this.purchasePlanData.peopleInvolvedDto.push({ userName: element });
        });
    }

    public goBack(): void {
        // this.router.navigate([`list`], { relativeTo: this.route.parent });
        this.location.back();
    }

    public onBtnSaveClick(): void {
        if (this.form) {
            if (!this.validateForm(this.form, 'id-form-purchase-plan')) {
                this.notificationService.showMessage('VALIDATION.FORM_VALID');
                return;
            }
            if (this.purchasePlanItem && this.purchasePlanItem.dataSource.items.length === 0) {
                this.notificationService.showWarning('COMMON_MSG.ITEM_EMPTY_WARNING');
                return;
            }
            if (this.form.dirty) {
                const saveConfirmation = new SaveConfirmation();
                saveConfirmation.accept = () => {
                    this.save();
                };
                this.notificationService.confirm(saveConfirmation);
            } else {
                this.goBack();
            }
        } else {
            this.goBack();
        }
    }

    public save(): void {
        // Set status là Đã tạo khi thêm mới
        if (!this.purchasePlanData.status) {
            this.purchasePlanData.status = this.ppStatus[0].value;
        }
        this.purchasePlanData.purchasePlanItems = this.purchasePlanItem.dataSource.items;
        const saveSub = this.purchasePlanService.merge(this.purchasePlanData).subscribe(res => {
            if (res && res.id) {
                this.notificationService.showSuccess();
                this.form.form.markAsPristine();
                this.goBack();
                if (this.purchasePlanData.contractId) {
                    // add thêm contract vào bảng contract nếu chưa có, có rồi thì update
                    this.contractService.selectByContractId(this.purchasePlanData.contractId).subscribe(m => {
                        if (m) {
                            const dataSave = {
                                ...this.purchasePlanData,
                                id: m.id
                            };
                            this.contractService.merge(dataSave).subscribe();
                        } else {
                            const dataSave = {
                                ...this.purchasePlanData
                            };
                            delete dataSave.id;
                            this.contractService.merge(dataSave).subscribe();
                        }
                    });
                }
            }
        });
        this.subscriptions.push(saveSub);
    }

    public onSelectContract(event?: any): void {
        this.purchasePlanData.contractNo = event ? event.numberOfContract : null;
        this.purchasePlanData.contractDescription = event ? event.description : null;
        this.purchasePlanData.contractType = event ? event.productTypeText : null;
        this.purchasePlanData.ceoCoo = event ? event.ceoFisx : null;
        this.purchasePlanData.signDate = event ? event.signDate : null;
        this.purchasePlanData.endDate = event ? event.endDate : null;
        this.purchasePlanData.amAccount = event ? event.am : null;
        this.purchasePlanData.pmAccount = event ? event.pm : null;
        this.purchasePlanData.overSixWeeks = event ? event.overSixWeeks : null;
        //
        this.purchasePlanData.contractId = event ? event.id : null;
        this.purchasePlanData.contractTypeText = event ? event.productTypeText : null;
        this.purchasePlanData.customer = event ? event.customerDetails : null;
        this.purchasePlanData.customerDetail = event ? event.customerDetails : null;
        this.purchasePlanData.accountingCode = event ? event.afContractId : null;
        this.purchasePlanData.projectCode = event ? event.afContractId : null;
        this.initDataDto();
        this.checkRole();
        this.cdr.detectChanges();
        this.form.form.markAsDirty();
    }

    public onChangeAmAccount(data) {
        if (data && data.length > 0) {
            data = data.filter(m => m.userName);
            this.purchasePlanData.amAccount = '';
            for (let i = 0; i < data.length; i++) {
                if (i === data.length - 1) {
                    this.purchasePlanData.amAccount += (data[i].userName);
                } else {
                    this.purchasePlanData.amAccount += (data[i].userName + ',');
                }
            }
        } else {
            this.purchasePlanData.amAccount = null;
        }
        this.checkRole();
    }

    public onChangePmAccount(data) {
        if (data && data.length > 0) {
            data = data.filter(m => m.userName);
            this.purchasePlanData.pmAccount = '';
            for (let i = 0; i < data.length; i++) {
                if (i === data.length - 1) {
                    this.purchasePlanData.pmAccount += (data[i].userName);
                } else {
                    this.purchasePlanData.pmAccount += (data[i].userName + ',');
                }
            }
        } else {
            this.purchasePlanData.pmAccount = null;
        }
        this.checkRole();
    }

    keydownContractNo(event) {
        if (!this.purchasePlanData.contractId) {
            event.preventDefault();
        }
    }

    public onSuccessInitFile(file: any) {
        if (file) {
            this.file = file;
        }
    }

    public onBtnCreateTicket(): void {
        if (!this.file) {
            this.notificationService.showWarning('Vui lòng đính kèm thông tin hợp đồng.');
            return;
        }
        if (this.form.dirty) {
            this.notificationService.showWarning('Vui lòng lưu trước khi thực hiện');
            return;
        }
        if (this.bpm) {
            this.bpm.isShowCreateTicketTemplate = true;
        }
    }

    public createTicketSuccess(sproDraftTicketId: number): void {
        if (sproDraftTicketId) {
            this.purchasePlanData.sproDraftTicketId = sproDraftTicketId;
            this.purchasePlanData.sproTicketId = null;
        }
    }

    public updateStatus(status: number): void {
        this.purchasePlanData.status = status;
        this.purchasePlanService.merge(this.purchasePlanData).subscribe();
    }

    public onChangeCurrency() {
        this.purchasePlanData.currency = this.purchasePlanData.currencyDto ? this.purchasePlanData.currencyDto.code : null;
    }

    public onChangePeopleInvolved(data) {
        if (this.purchasePlanData.peopleInvolvedDto) {
            const listUserName = this.purchasePlanData.peopleInvolvedDto.map(({ userName }) => userName);
            this.purchasePlanData.peopleInvolved = listUserName.join(',');
        }
    }

    public uploadedFile(event?: any) {
        if (event && event.length > 0) {
            const request: any = {
                id: this.purchasePlanData.id
            };
            this.purchasePlanService.uploadedFile(request).subscribe();
        }
    }

    public onChangeCustomer(event: any) {
        if (this.purchasePlanData.customer) {
            this.purchasePlanData.customer = this.purchasePlanData.customer.trim();
        }
    }

    public titleButtonCreateTicket(object: any) {
        let text = '';
        if (object.sproDraftTicketId) {
            text = 'Đã tạo bản nháp trên BA Online';
        } else {
            text = 'COMMON.SUBMIT_APPROVAL';
        }
        if (object.status === 6) {
            text = 'Đã bị từ chối phê duyệt, có thể gửi phê duyệt lại';
        }
        return text;
    }
}
