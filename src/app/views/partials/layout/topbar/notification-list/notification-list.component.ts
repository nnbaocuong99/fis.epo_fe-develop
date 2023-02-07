import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { currentUser } from '../../../../../core/auth';
import { AppState } from '../../../../../core/reducers';
import { BaseListComponent } from '../../../../../core/_base/component';

import * as mainConfig from '../../../../../core/_config/main.config';
import { ActivatedRoute, Router } from '@angular/router';
import { MailScheduleService } from '../../../../../services/modules/mail-schedule/mail-schedule.service';
import { MailScheduleRequestPayload } from '../../../../../services/modules/mail-schedule/mail-schedule.request.payload';
@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent extends BaseListComponent implements OnInit {
  // Show dot on top of the icon
  @Input() dot: string;

  // Show pulse on icon
  @Input() pulse: boolean;

  @Input() pulseLight: boolean;

  // Set icon class name
  @Input() icon = 'flaticon2-bell-alarm-symbol';
  @Input() iconType: '' | 'success';

  // Set true to icon as SVG or false as icon class
  @Input() useSVG: boolean;

  // Set bg image path
  @Input() bgImage: string;

  // Set skin color, default to light
  @Input() skin: 'light' | 'dark' = 'light';

  @Input() type: 'brand' | 'success' = 'success';

  public notificationListData: any;
  public unreadNoticeNumber = 0;
  public useNameLoginData: any = {};
  /**
   * Component constructor
   *
   * @param sanitizer: DomSanitizer
   */
  constructor(
    private mailScheduleService: MailScheduleService,
    private cdr: ChangeDetectorRef,
    private store: Store<AppState>,
    public router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit(): void {
    this.mainConfig = mainConfig.MAIN_CONFIG;
    this.store.select(currentUser).pipe(take(1)).subscribe(res => {
      if (res) {
        this.useNameLoginData = res;
        this.initData();
      }
    });
  }

  public initData(): void {
    this.request = new MailScheduleRequestPayload();
    this.request.sendTo = this.useNameLoginData.userName;
    const initSub = this.mailScheduleService.select(this.request).subscribe(res => {
      if (res) {
        res = res.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        res.reverse();
        this.notificationListData = res;
        const arr = [];
        let domainChangerouterLink = '';

        if (document.domain === 'localhost') {
          domainChangerouterLink = 'http://localhost:4200';
        }
        if (document.domain === 'uat-fisepo.paas.xplat.fpt.com.vn') {
          domainChangerouterLink = 'https://uat-fisepo.paas.xplat.fpt.com.vn';
        }
        this.notificationListData.find(x => {
          if (domainChangerouterLink !== '') {
            x.body = x.body.replace('https://insight.fis.com.vn/epo', domainChangerouterLink);
          }
          let index = x.body.indexOf('<body>');
          let temp = x.body.slice(index + 9, x.body.length);
          index = temp.indexOf('<p> Regards');
          temp = temp.slice(0, index);
          temp = temp.split('<p> &emsp;');
          x.bodyTitle = temp[1] ? temp[1].replace('</p>\r\n', '') : '';
          x.bodyRequestType = temp[2] ? temp[2].replace('</p>\r\n', '') : '';
          x.bodyRequestorDepartment = temp[4] ? temp[4].replace('</p>\r\n', '') : '';
          x.bodyDescriptions = temp[5] ? temp[5].replace('</p>\r\n', '') : '';
          x.bodyNote = temp[6] ? temp[6].split('\r\n')[0].replace('</p>', '') : '';
          // x.bodyRead = x.body.replace('\r\n  <p> Regards, </p>\r\n  <p> <b>FIS_ePO</b> </p>\r\n</body>\r\n\r\n</html>', '');
          // x.bodyRead = x.bodyRead.replace('&emsp;', '');
          // x.bodyRead = x.bodyRead.replace('\r\n', '<br>');
          if (x.usersRead && !x.usersRead.toString().search(this.useNameLoginData.userName)) {
            x.unread = 0;
          } else {
            x.unread = 1;
            arr.push(x);
          }
        });
        this.unreadNoticeNumber = arr.length;
      }
      this.cdr.detectChanges();
    });
    this.subscriptions.push(initSub);
  }

  public onChangerouterLink(id: any, module: string): void {
    const pathStrings = document.location.pathname.split('/');
    pathStrings.length = 3;
    pathStrings.splice(0, 1);

    if (module === 'purchase-request') {
      this.router.navigateByUrl(`/apps/management/purchase-request/list/view/${id}`);
    }

    if (module === 'purchase-order') {
      this.router.navigateByUrl(`/apps/management/purchase-order/list/view/${id}`);
    }

    if (module === 'Request-import-goods' || module === 'Calculate-tax' || module === 'Suggestion-import') {
      this.router.navigateByUrl(`/apps/management/purchase-invoice/list/view/${id}`);
      // this.router.navigate([path + `/purchase-invoice/list/view/${id}`], { relativeTo: this.activatedRoute });
    }

    if (module === 'shipment') {
      this.router.navigateByUrl(`/apps/management/shipment/list/view/${id}`);
    }

    if (module === 'import-goods-shipment') {
      this.router.navigateByUrl(`/apps/management/import-goods/shipment/${id}`);
    }
    if (module === 'import-goods-invoice') {
      this.router.navigateByUrl(`/apps/management/import-goods/invoice/${id}`);
    }

  }

  backGroundStyle(): string {
    if (!this.bgImage) {
      return 'none';
    }

    return 'url(' + this.bgImage + ')';
  }

  public onBtnSaveAsReadNotification(rowData: any) {
    if (rowData && rowData.unread === 1) {
      // Add user read
      rowData.usersRead = rowData.usersRead ? (rowData.usersRead + ';' + this.useNameLoginData.userName) : this.useNameLoginData.userName;
      const resSave = this.mailScheduleService.merge(rowData).subscribe(res => {
        if (res) {
          this.initData();
          this.cdr.detectChanges();
        }
      });
      this.subscriptions.push(resSave);
    }
  }
}
