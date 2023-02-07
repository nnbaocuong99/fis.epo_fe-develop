import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseFormComponent } from '../../../../../../core/_base/component/base-form.component';
import { NotificationService } from '../../../../../../services/common/notification/notification.service';
import { DialogRef } from '../../../../../partials/content/crud/dialog/dialog-ref.model';
import { FileService } from '../../../../../../services/modules/file/file.service';
import { SaveConfirmation } from '../../../../../../services/common/confirmation/save-confirmation';
import { CurrencyMaskPipe } from '../../../../../../core/_base/layout';
import * as mainConfig from '../../../../../../core/_config/main.config';
@Component({
  selector: 'app-dialog-request-import',
  templateUrl: './dialog-request-import.component.html',
  styleUrls: ['./dialog-request-import.component.scss']
})
export class DialogRequestImportComponent extends BaseFormComponent implements OnInit {
  @Output() success: EventEmitter<any> = new EventEmitter();
  @Input() orgChart: any;
  // @Input() purchaseInvoiceItemsData
  _purchaseInvoiceItemsData: any;
  get purchaseInvoiceItemsData(): any {
    return this._purchaseInvoiceItemsData;
  }
  @Input() set purchaseInvoiceItemsData(value: any) {
    this._purchaseInvoiceItemsData = value;
    this.listitems = [];
    const listPoCode = [];
    const listsubInventoryName = [];
    if (this.purchaseInvoiceItemsData && this.purchaseInvoiceItemsData.length > 0) {
      this.purchaseInvoiceItemsData.map(x => {
        this.listitems.push(x.data);
        if (x.data.code && !listPoCode.find(po => po === x.data.code)) {
          listPoCode.push(x.data.code);
        }
        if (x.data.subInventoryName && !listsubInventoryName.find(sub => sub === x.data.subInventoryName)) {
          listsubInventoryName.push(x.data.subInventoryName);
        }
        if (x.children && x.children.length > 0) {
          x.children.map(chi => {
            this.listitems.push(chi.data);
            if (chi.data.code && !listPoCode.find(po => po === chi.data.code)) {
              listPoCode.push(chi.data.code);
            }
            if (chi.data.subInventoryName && !listsubInventoryName.find(sub => sub === chi.data.subInventoryName)) {
              listsubInventoryName.push(chi.data.subInventoryName);
            }
          });
        }
      });
      this.subInventoryName = listsubInventoryName.join(',');
      this.poNumber = listPoCode.join(',');
      let moneyTotal = 0;
      this.listitems.map(x => {
        if (x.price && x.quantity) {
          moneyTotal += +(x.price * x.quantity);
        }
      });
      this.moneyTotal = +moneyTotal.toFixed(0);
    }
  }

  // @Input() purchaseInvoiceData
  _purchaseInvoiceData: any;
  get purchaseInvoiceData(): any {
    return this._purchaseInvoiceData;
  }
  @Input() set purchaseInvoiceData(data: any) {
    this._purchaseInvoiceData = data;
    if (this.purchaseInvoiceData && this.purchaseInvoiceData.date) {
      const invoiceDateTime = new Date(this.purchaseInvoiceData.date);
      const dd = invoiceDateTime.getDate();
      const mm = invoiceDateTime.getMonth() + 1;
      this.invoiceNumberMaintenance = this.purchaseInvoiceData.code + ((dd < 10) ? ('0' + dd) : dd) + ((mm < 10) ? ('0' + mm) : mm);
    }
  }
  public dialogRef: DialogRef = new DialogRef();
  public listitems = [];
  public chuSo = new Array(' không ', ' một ', ' hai ', ' ba ', ' bốn ', ' năm ', ' sáu ', ' bảy ', ' tám ', ' chín ');
  public tien = new Array('', ' nghìn', ' triệu', ' tỷ', ' nghìn tỷ', ' triệu tỷ');
  public moneyTotal: number;
  public poNumber: string;
  public subInventoryName: string;
  public mainConfig = mainConfig.MAIN_CONFIG;
  public invoiceNumberMaintenance: string;

  constructor(
    private notificationService: NotificationService,
    public fileService: FileService,
    public cdr: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
  }

  public readCurrencyToString(sotien: any) {
    let lan = 0;
    let i = 0;
    let so = 0;
    let ketQua = '';
    let tmp = '';
    let soAm = false;
    const viTri = new Array();
    if (sotien < 0) { soAm = true; } // return "Số tiền âm !";
    if (sotien === 0) { return 'Không đồng'; } // "Không đồng !";
    if (sotien > 0) {
      so = sotien;
    } else {
      so = -sotien;
    }
    if (sotien > 8999999999999999) {
      // sotien = 0;
      return ''; // "Số quá lớn!";
    }
    viTri[5] = Math.floor(so / 1000000000000000);
    if (isNaN(viTri[5])) {
      viTri[5] = '0';
    }
    so = so - parseFloat(viTri[5].toString()) * 1000000000000000;
    viTri[4] = Math.floor(so / 1000000000000);
    if (isNaN(viTri[4])) {
      viTri[4] = '0';
    }
    so = so - parseFloat(viTri[4].toString()) * 1000000000000;
    viTri[3] = Math.floor(so / 1000000000);
    if (isNaN(viTri[3])) {
      viTri[3] = '0';
    }
    so = so - parseFloat(viTri[3].toString()) * 1000000000;
    // tslint:disable-next-line:radix
    viTri[2] = parseInt((so / 1000000).toString());
    if (isNaN(viTri[2])) {
      viTri[2] = '0';
    }
    // tslint:disable-next-line:radix
    viTri[1] = parseInt(((so % 1000000) / 1000).toString());
    if (isNaN(viTri[1])) {
      viTri[1] = '0';
    }
    // tslint:disable-next-line:radix
    viTri[0] = parseInt((so % 1000).toString());
    if (isNaN(viTri[0])) {
      viTri[0] = '0';
    }
    if (viTri[5] > 0) {
      lan = 5;
    } else if (viTri[4] > 0) {
      lan = 4;
    } else if (viTri[3] > 0) {
      lan = 3;
    } else if (viTri[2] > 0) {
      lan = 2;
    } else if (viTri[1] > 0) {
      lan = 1;
    } else {
      lan = 0;
    }
    for (i = lan; i >= 0; i--) {
      tmp = this.docSo3chuSo(viTri[i]);
      ketQua += tmp;
      if (viTri[i] > 0) { ketQua += this.tien[i]; }
      if ((i > 0) && (tmp.length > 0)) { ketQua += ''; } // ',';//&& (!string.IsNullOrEmpty(tmp))
    }
    if (ketQua.substring(ketQua.length - 1) === ',') {
      ketQua = ketQua.substring(0, ketQua.length - 1);
    }
    ketQua = ketQua.substring(1, 2).toUpperCase() + ketQua.substring(2);
    if (soAm) {
      return 'Âm ' + ketQua + ' đồng'; // substring(0, 1);//.toUpperCase();// + ketQua.substring(1);
    } else {
      return ketQua + ' đồng'; // substring(0, 1);//.toUpperCase();// + ketQua.substring(1);
    }
  }

  public docSo3chuSo(baso: any) {
    let tram: number;
    let chuc;
    let donvi;
    let ketQua = '';
    // tslint:disable-next-line:radix
    tram = parseInt((baso / 100).toString());
    // tslint:disable-next-line:radix
    chuc = parseInt(((baso % 100) / 10).toString());

    donvi = baso % 10;
    if (tram === 0 && chuc === 0 && donvi === 0) { return ''; }
    if (tram !== 0) {
      ketQua += this.chuSo[tram] + ' trăm ';
      if ((chuc === 0) && (donvi !== 0)) { ketQua += ' linh '; }
    }
    if ((chuc !== 0) && (chuc !== 1)) {
      ketQua += this.chuSo[chuc] + ' mươi';
      if ((chuc === 0) && (donvi !== 0)) { ketQua = ketQua + ' linh '; }
    }
    if (chuc === 1) { ketQua += ' mười '; }
    switch (donvi) {
      case 1:
        if ((chuc !== 0) && (chuc !== 1)) {
          ketQua += ' mốt ';
        } else {
          ketQua += this.chuSo[donvi];
        }
        break;
      case 5:
        if (chuc === 0) {
          ketQua += this.chuSo[donvi];
        } else {
          ketQua += ' lăm ';
        }
        break;
      default:
        if (donvi !== 0) {
          ketQua += this.chuSo[donvi];
        }
        break;
    }
    return ketQua;
  }

  public getDatetime(type: any) {
    let result: any;
    const today = new Date();
    if (type === 'dd') {
      result = String(today.getDate()).padStart(2, '0');
    }
    if (type === 'mm') {
      result = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!;
    }
    if (type === 'yyyy') {
      result = today.getFullYear();
    }

    return (result);
  }

  public onShowDialog(): void {
    this.dialogRef.show();
    this.cdr.detectChanges();
  }

  public printPage(): void {
    const printContent = document.getElementById('print-page');
    const windowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    // windowPrt.document.write(printContent.innerHTML);
    windowPrt.document.write('<html><head><title></title>');
    windowPrt.document.write('</head><body >');
    windowPrt.document.write(printContent.innerHTML);
    windowPrt.document.write('</body></html>');
    // windowPrt.document.close();
    windowPrt.focus();
    windowPrt.print();
    windowPrt.close();
    // window.print();
  }

  public onBtnSaveClick(): void {
    const saveConfirmation = new SaveConfirmation();
    saveConfirmation.accept = () => {
      this.success.emit(this.purchaseInvoiceData.useNameLoginData.id);
    };
    this.notificationService.confirm(saveConfirmation);
  }

  public close() {
    this.dialogRef.hide();
  }

  public convertCurrencyMask(price: any): string {
    if (price) {
      const result = this.format(price, 0, 3, ',', '.');
      return result;
    } else {
      return '';
    }
  }

  private format(value: any, n: any, x: any, s: any, c: any) {
    let result = '';
    if (value != null && value !== undefined) {
      if (typeof (value) === 'string') {
        value = parseFloat(value);
      }
      const re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')';
      const num = value.toFixed(Math.max(0, n));
      result = (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
    }
    return result;
  }

}
