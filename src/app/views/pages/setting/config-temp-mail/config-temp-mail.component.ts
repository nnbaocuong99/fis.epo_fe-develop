import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseListComponent } from '../../../../core/_base/component';
import * as mainConfig from '../../../../core/_config/main.config';
import { TempMailRequestPayload } from '../../../../services/modules/config-temp-mail/config-temp-mail.request-payload';
import { TempMailService } from '../../../../services/modules/config-temp-mail/config-temp-mail.service';
import { DialogRef } from '../../../partials/content/crud/dialog/dialog-ref.model';
import { ToolbarModel } from '../../../partials/content/toolbar/toolbar.model';
import * as config from './config-temp-mail.config';
@Component({
  selector: 'app-config-temp-mail',
  templateUrl: './config-temp-mail.component.html',
  styleUrls: ['./config-temp-mail.component.scss']
})
export class ConfigTempMailComponent extends BaseListComponent implements OnInit {
  @ViewChild('formFilter', { static: true }) formFilter: NgForm;
  public dialogRef: DialogRef = new DialogRef();
  public toolbarModel: ToolbarModel;
  public status = config.STATUS;
  public cols = config.HEADER;

  constructor(
    public tempMailService: TempMailService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute
  ) { super(); }

  ngOnInit() {
    this.cd = this.cdr;
    this.mainConfig = mainConfig.MAIN_CONFIG;
    this.baseService = this.tempMailService;
    this.request = new TempMailRequestPayload();
    this.configToolbar();
    super.ngOnInit();
  }

  private configToolbar(): void {
    this.toolbarModel = new ToolbarModel();
    this.toolbarModel.add.click = () => this.onBtnAddCLick();
    this.toolbarModel.option.disabled = true;
  }

  public onSearch() {
    super.ngOnInit();
  }

  public onReset() {
    this.request = new TempMailRequestPayload();
  }

  public onBtnAddCLick(id?: any) {
    if (id) {
      this.router.navigate([`edit/${id}`], { relativeTo: this.route });
    } else {
      this.router.navigate([`add`], { relativeTo: this.route });
    }
  }
}
