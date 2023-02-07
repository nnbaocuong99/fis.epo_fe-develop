import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { FormDynamicData } from '../../../../partials/content/crud/component/form-dynamic-data.model';
import { BpmService } from '../../../../../services/modules/s-pro/bpm.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MappingSproService } from '../../../../../services/modules/mapping-spro/mapping-spro.service';
import { NotificationService } from '../../../../../services/common/notification/notification.service';
import * as mainConfig from '../../../../../core/_config/main.config';
import * as config from './mapping-spro-edit.config';
import * as configParent from '../mapping-spro.config';
import { BaseFormComponent } from '../../../../../core/_base/component/base-form.component';
import { SaveConfirmation } from '../../../../../services/common/confirmation/save-confirmation';
import { Location } from '@angular/common';

@Component({
  selector: 'app-mapping-spro-edit',
  templateUrl: './mapping-spro-edit.component.html',
  styleUrls: ['./mapping-spro-edit.component.scss']
})
export class MappingSproEditComponent extends BaseFormComponent implements OnInit {
  @ViewChild('form', { static: true }) form: NgForm;
  public formData: FormDynamicData = new FormDynamicData();
  public mappingSproData: any = {};
  public processDatas$: Observable<any[]>;
  public requestBody: any;
  public params: any[] = [];
  public items: any[] = [];
  public mainConfig: any = mainConfig.MAIN_CONFIG;
  public headers = config.HEADER;
  public headerItems = config.HEADER_ITEMS;
  public isRequired = false;
  public isLoadingProcess = true;
  private cloneParams: any[];
  public properties = [];
  public propertiesItem = [];
  public modules = configParent.MODULE;
  public showDetail = false;
  public currentMappingSproId: string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public bpmService: BpmService,
    public mappingSproService: MappingSproService,
    public cd: ChangeDetectorRef,
    public notification: NotificationService
  ) {
    super();
    this.formData = {
      formId: 'mapping-spro-edit',
      title: 'MAPPING_SPRO.HEADER_DETAIL',
      isCancel: true,
      service: this.mappingSproService
    };
  }

  ngOnInit() {
    this.processDatas$ = this.bpmService.getServices('').pipe(
      map(res => {
        this.isLoadingProcess = false;
        if (res.listData) {
          return res.listData.filter(x => x.type === 4);
        }
      })
    );
    const routeSub = this.route.params.subscribe(params => {
      if (params.id) {
        this.currentMappingSproId = params.id;
        this.mappingSproService.selectById(params.id).subscribe(res => {
          this.mappingSproData = res;
          this.onChangeProcess(res.processId);
          this.onChangeModule({ value: res.module });
          this.cd.detectChanges();
          this.form.form.markAsPristine();
        });
      } else {
        this.mappingSproData = {};
      }
    });
    this.subscriptions.push(routeSub);
  }

  public onBtnCancelClick(): void {
    this.goBack();
  }

  public goBack(): void {
    this.router.navigate([`feature/mapping-spro`], { relativeTo: this.route.parent });
  }

  public onBtnSaveClick(): void {
    if (this.form) {
      if (!this.validateForm(this.form, 'mapping-spro-edit')) {
        this.notification.showMessage('VALIDATION.FORM_VALID');
        return;
      }
      if (this.form.dirty) {
        const saveConfirmation = new SaveConfirmation();
        saveConfirmation.accept = () => {
          this.createParamSave();
          const mergeSub = this.mappingSproService.merge(this.mappingSproData).subscribe(resHeader => {
            this.notification.showSuccess();
            this.goBack();
          });
          this.subscriptions.push(mergeSub);
        };
        this.notification.confirm(saveConfirmation);
      } else {
        this.goBack();
      }
    } else {
      this.goBack();
    }
  }

  public onChangeProcess(processId): void {
    this.mappingSproData.processId = processId;
    const getProcessSub = this.bpmService.getProcess(processId).subscribe(res => {
      if (res.data) {
        this.requestBody = res;
        // get data mapping
        this.mappingSproService.select().subscribe(rs => {
          this.mappingSproData.processName = res.data.processName;
          this.params = res.data.ticket_template.individual;
          if (res.data.ticket_template.table) {
            this.items = res.data.ticket_template.table.columns;
          }

          if (this.mappingSproData.mappingField) {
            this.mappingSproData.mappingField = JSON.parse(this.mappingSproData.mappingField);
            this.params.map(x => {
              const obj = this.mappingSproData.mappingField.find(temp => temp.sproId === x.id || temp.sproField === x.name);
              if (obj) {
                x.epoField = obj.epoField;
                x.link = obj.link;
                x.push = obj.push;
              }
              return x;
            });
          }
          this.cloneParams = this.params;

          if (this.mappingSproData.mappingFieldItem) {
            this.mappingSproData.mappingFieldItem = JSON.parse(this.mappingSproData.mappingFieldItem);
            this.items.map(x => {
              const obj = this.mappingSproData.mappingFieldItem.find(temp => temp.sproId === x.id || temp.sproField === x.name);
              if (obj) {
                x.epoField = obj.epoField;
                x.push = obj.push;
              }
              return x;
            });
          }

          this.refresh();
        });
      } else {
        this.params = [];
      }
    });
    this.subscriptions.push(getProcessSub);
  }

  public changeRequired(event): void {
    if (event.checked) {
      this.isRequired = true;
      this.params = this.params.filter(x => x.conditions != null && x.conditions.required);
    } else {
      this.isRequired = false;
      this.params = this.cloneParams;
    }
  }

  public onChangeModule(data): void {
    this.properties = [];
    this.mappingSproService.getModel(data.value).subscribe(res => {
      this.properties = res.map(x => {
        return { name: x, value: x };
      });
      if (data.value === 'PURCHASE_PLAN') {
        this.mappingSproService.getModel('PURCHASE_PLAN_ITEM').subscribe(m => {
          this.propertiesItem = m.map(x => {
            return { name: x, value: x };
          });
        });
      }
      if (data.value === 'PURCHASE_REQUEST') {
        this.mappingSproService.getModel('PURCHASE_REQUEST_ITEM').subscribe(m => {
          this.propertiesItem = m.map(x => {
            return { name: x, value: x };
          });
        });
      }
      this.refresh();
    });
  }

  private createParamSave(): void {
    this.mappingSproData.requestBody = JSON.stringify(this.requestBody);
    this.mappingSproData.params = JSON.stringify(this.params);

    const mappingModel = [];
    this.params.map(x => {
      if (x.epoField || x.push) {
        const temp: any = { sproId: x.id, sproField: x.name };
        if (x.epoField) {
          temp.epoField = x.epoField;
        }
        if (x.link) {
          temp.link = x.link;
        }
        if (x.push) {
          temp.push = x.push;
        }
        mappingModel.push(temp);
      }
    });
    this.mappingSproData.mappingField = JSON.stringify(mappingModel);

    const mappingModelItem = [];
    this.items.map(x => {
      if (x.epoField || x.push) {
        const temp: any = { sproId: x.id, sproField: x.name };
        if (x.epoField) {
          temp.epoField = x.epoField;
        }
        if (x.push) {
          temp.push = x.push;
        }
        mappingModelItem.push(temp);
      }
    });
    this.mappingSproData.mappingFieldItem = JSON.stringify(mappingModelItem);
  }

  private refresh(): void {
    this.showDetail = false;
    this.cd.detectChanges();
    this.showDetail = true;
    this.cd.detectChanges();
  }

  public addTagFn(name: string) {
    return name;
  }

}
