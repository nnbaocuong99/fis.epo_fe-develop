import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { TreeNode } from 'primeng/api';
import * as config from './org-chart.config';
import * as mainConfig from '../../../../core/_config/main.config';
import { NgForm } from '@angular/forms';
import { NotificationService } from '../../../../services/common/notification/notification.service';
import { OrgChartService } from '../../../../services/modules/org-chart/org-chart.service';
import { BaseComponent } from '../../../../core/_base/component/base-component';
import { FormDynamicData } from '../../../partials/content/crud/component/form-dynamic-data.model';
import { Guid } from 'guid-typescript';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { CancelConfirmation } from '../../../../services/common/confirmation/cancel-confirmation';

@Component({
    selector: 'app-org-chart',
    templateUrl: './org-chart.component.html',
    styleUrls: ['./org-chart.component.scss'],
})
export class OrgChartComponent extends BaseComponent implements OnInit {
    @ViewChild('form', { static: true }) form: NgForm;
    public formData: FormDynamicData = new FormDynamicData();
    public cols: any[] = config.COLS;
    public mainConfig: any = mainConfig.MAIN_CONFIG;
    public treeData: TreeNode[];
    public selectedOrg: TreeNode;
    public orgChartData: any = {};
    public formTitle = 'ORG_CHART.HEADER_LIST';
    public key: string;
    @ViewChild('dlgConfirm1', { static: true }) dlgConfirm: ConfirmDialog;

    constructor(
        public orgChartService: OrgChartService,
        public notice: NotificationService,
        private cdr: ChangeDetectorRef,
        private notification: NotificationService
    ) {
        super();
        this.formData = {
            formId: 'org-chart-edit',
            title: this.formTitle,
            service: this.orgChartService,
        };
    }

    ngOnInit() {
        this.key = Guid.create().toString();
        this.initData();
    }

    public initData(): void {
        const selectSub = this.orgChartService
            .getTreeView()
            .subscribe((response) => {
                this.treeData = [...response];
                this.cdr.detectChanges();
                setTimeout(() => {
                    this.form.form.markAsPristine();
                }, 0);
            });
        this.subscriptions.push(selectSub);
    }

    public onNodeSelect(event?: any): void {
        const id = event ? event.node.data.id : null;
        this.getOrgById(id);
    }

    public onNodeUnselect(): void {
        this.resetForm();
    }

    private getOrgById(id: string): void {
        const selectSub = this.orgChartService
            .selectById(id)
            .subscribe((res) => {
                this.orgChartData = res;
                this.cdr.detectChanges();
                setTimeout(() => {
                    this.form.form.markAsPristine();
                }, 0);
            });
        this.subscriptions.push(selectSub);
    }

    public onBtnSaveClick(): void {
        if (!this.orgChartData.id) {
            const insertSub = this.orgChartService
                .insert(this.orgChartData)
                .subscribe((response) => {
                    this.initData();
                    this.orgChartData = {};
                    this.notice.showSuccess();
                    this.cdr.detectChanges();
                });
            this.subscriptions.push(insertSub);
        } else {
            const updateSub = this.orgChartService
                .update(this.orgChartData)
                .subscribe((response) => {
                    if (response.id) {
                        this.initData();
                        this.orgChartService
                            .selectById(response.parentId)
                            .subscribe((resParent) => {
                                this.orgChartData.parentId = resParent;
                                this.cdr.detectChanges();
                            });
                        this.notice.showSuccess();
                    } else {
                        this.notice.showError();
                    }
                });
            this.subscriptions.push(updateSub);
        }
    }

    public addOrgChart(): void {
        if (this.form) {
            if (this.form.form.dirty) {
                const cancelConfirmation = new CancelConfirmation();
                cancelConfirmation.accept = () => {
                    this.resetForm();
                };
                this.notification.confirm(cancelConfirmation);
            } else {
                if (this.orgChartData) {
                    this.orgChartData = {};
                }
                this.form.form.markAsPristine();
            }
        }
    }

    public onBtnCancelClick() {
        if (this.form.form.dirty) {
            this.resetForm();
        }
    }

    private resetForm(): void {
        if (this.selectedOrg != null) {
            this.getOrgById(this.selectedOrg.data.id);
        } else {
            if (this.orgChartData) {
                this.orgChartData = {};
            }
            this.form.form.markAsPristine();
        }
    }
}
