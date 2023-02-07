import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { forkJoin } from 'rxjs';
import { BaseComponent } from '../../../../../../core/_base/component/base-component';
import { CancelConfirmation, SaveConfirmation } from '../../../../../../services/common/confirmation';
import { NotificationService } from '../../../../../../services/common/notification/notification.service';
import { ActionRequestPayload } from '../../../../../../services/modules/action/action.request.payload';
import { ActionService } from '../../../../../../services/modules/action/action.service';
import { BusinessTaskService } from '../../../../../../services/modules/business-task/business-task.service';
import { OperationRequestPayload } from '../../../../../../services/modules/operation/operation-request.payload';
import { OperationService } from '../../../../../../services/modules/operation/operation.service';
import { DialogRef } from '../../../../../partials/content/crud/dialog/dialog-ref.model';

@Component({
    selector: 'app-operation-action',
    templateUrl: './operation-action-add.component.html',
    styleUrls: ['./operation-action-add.component.scss']
})
export class OperationActionAddComponent extends BaseComponent implements OnInit {
    @ViewChild('form', { static: true }) form: NgForm;
    @Input() dialogRef: DialogRef;
    @Output() success: EventEmitter<any> = new EventEmitter();
    public dataSource: any = {};
    public actionDataSource = [];
    public selectedAction: any;
    public request = new ActionRequestPayload();
    public operationRequestPayLoad = new OperationRequestPayload();
    public stepModel = {
        currentStep: 1,
        1: {
            icon: 'fal fa-mouse-pointer',
            header: 'Step 1: Choose an API'
        },
        2: {
            icon: 'fal fa-tools',
            header: 'Step 2: Customization'
        },
        actionData: {} as any
    };
    public inOutType = [{ label: 'Request', value: 0 }, { label: 'Response', value: 1 }];

    constructor(
        public actionService: ActionService,
        public operationService: OperationService,
        public businessTaskService: BusinessTaskService,
        public notification: NotificationService,
        public cd: ChangeDetectorRef) {
        super();
    }

    ngOnInit() {
        this.request.pageIndex = 0;
        this.request.pageSize = 10;
        this.operationRequestPayLoad.pageIndex = 0;
        this.operationRequestPayLoad.pageSize = 10;
        this.initData();
    }

    public initData(): void {
        const $selectAndCount = [
            this.actionService.select(this.request),
            this.actionService.count(this.request)];

        const sub = forkJoin($selectAndCount).subscribe(
            (response: any[]) => {
                this.dataSource.items = response[0];
                this.dataSource.paginatorTotal = response[1];
                if (this.cd && !this.cd['destroyed']) {
                    this.cd.detectChanges();
                }
            });

        this.subscriptions.push(sub);
    }

    public onPageChange(event: PageEvent) {
        this.request.pageIndex = event.pageIndex;
        this.request.pageSize = event.pageSize;

        this.initData();
    }

    public onBtnNextClick() {
        // if (this.selectedActions && this.selectedActions.length > 0) {
        //     const save = new SaveConfirmation();
        //     save.accept = () => {
        //         this.dialogRef.input.actionId = this.selectedActions.map(e => e.id);
        //         this.operationService.bulkMergeAction(this.dialogRef.input).subscribe(res => {
        //             this.notification.showSuccess();
        //             this.success.emit(true);
        //             this.dialogRef.hide();
        //             if (this.cd && !this.cd['destroyed']) {
        //                 this.cd.detectChanges();
        //             }
        //             this.resetVariables();
        //         });
        //     };
        //     this.notification.confirm(save);
        // } else {
        //     this.dialogRef.hide();
        //     if (this.cd && !this.cd['destroyed']) {
        //         this.cd.detectChanges();
        //     }
        //     this.resetVariables();
        // }

        const save = new SaveConfirmation();
        save.accept = () => {
            if (this.stepModel.currentStep === 1) {
                if (!this.selectedAction) {
                    this.notification.showInfo('Vui lòng chọn API để tiếp tục');
                    return;
                }

                this.stepModel.currentStep++;
                this.stepModel.actionData.api = { ...this.selectedAction };
                this.stepModel.actionData.name = this.stepModel.actionData.api.routePath;
                console.log(this.stepModel.actionData.api);

                const actionRequest = new ActionRequestPayload();
                actionRequest.id = this.stepModel.actionData.api.id;
                this.actionService.selectActionInOut(actionRequest).subscribe(res => {
                    this.actionDataSource = res;
                    this.cd.detectChanges();
                })
            } else if (this.stepModel.currentStep === 2) {
                const jsonConfig = JSON.stringify(
                    this.actionDataSource.map(x => {
                        return {
                            id: x.id,
                            defaultValue: x.defaultValue,
                            scopeValue: x.scopeValue,
                            restricted: x.restricted
                        };
                    })
                )

                const businessTask: any = {
                    name: this.stepModel.actionData.name,
                    actionId: this.stepModel.actionData.api.id,
                    jsonConfig: jsonConfig,
                    note: this.stepModel.actionData.note
                };
                const params: any = {
                    operationId: this.dialogRef.input.id
                };

                this.businessTaskService.mergeWithRelationToOperation(businessTask, true, params).subscribe(() => {
                    this.notification.showSuccess();
                    this.success.emit(true);
                    this.dialogRef.hide();
                    this.resetVariables();
                    if (this.cd && !this.cd['destroyed']) {
                        this.cd.detectChanges();
                    }
                });
            }
        }

        this.notification.confirm(save);
    }

    public onBtnBackClick(): void {
        if (this.stepModel.currentStep > 1) {
            this.stepModel.currentStep--;
        }
    }

    private resetVariables() {
        this.request.pageIndex = 0;
        this.request.pageSize = 10;
        this.selectedAction = null;
        this.dataSource.items = null;
        this.dataSource.paginatorTotal = null;
    }

    public onBtnCancel() {
        if (this.selectedAction && this.selectedAction.length > 0) {

            const cancel = new CancelConfirmation();
            cancel.accept = () => {
                this.notification.showSuccess();
                this.dialogRef.hide();
                if (this.cd && !this.cd['destroyed']) {
                    this.cd.detectChanges();
                }
                this.resetVariables();

            };
            this.notification.confirm(cancel);
        } else {
            this.dialogRef.hide();
            if (this.cd && !this.cd['destroyed']) {
                this.cd.detectChanges();
            }
            this.resetVariables();


        }
        // if (this.form) {
        //     if (this.form.form.touched) {
        //         const cancel = new SaveConfirmation();
        //         cancel.accept = () => {
        //             this.selectedActions = null; 
        //             this.dialogRef.hide();
        //             this.cd.detectChanges();
        //         };
        //         this.notification.confirm(cancel);
        //     } else {
        //         this.dialogRef.hide();
        //         this.cd.detectChanges();
        //     }
        // } else {
        //     this.dialogRef.hide();
        //     this.cd.detectChanges();
        // }
    }

    public onShow() {
        this.operationRequestPayLoad.id = this.dialogRef.input.id;
        this.request.excludeOperationId = this.dialogRef.input.id;
        const $selectAndCount = [
            this.actionService.select(this.request),
            this.actionService.count(this.request)];

        const sub = forkJoin($selectAndCount).subscribe(
            (response: any[]) => {
                this.dataSource.items = response[0];
                this.dataSource.paginatorTotal = response[1];
                if (this.cd && !this.cd['destroyed']) {
                    this.cd.detectChanges();
                }
            });

        this.subscriptions.push(sub);
    }

    public addTagFn(name: any) {
        return name;
    }

    public onScopeValueChange(event: any, rowData: any) {
        if (event && event.length > 0) {
            rowData.scopeValue = event.join(',');
        } else {
            rowData.scopeValue = undefined;
        }
    }
}
