import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MenuItem } from 'primeng/api/menuitem';
import { BaseFormComponent } from '../../../../../../core/_base/component';
import {
  BrandMarketingFundItemRequestPayload
} from '../../../../../../services/modules/category/brand-marketing-fund-item/brand-marketing-fund-item.request.payload';
import {
  BrandMarketingFundItemService
} from '../../../../../../services/modules/category/brand-marketing-fund-item/brand-marketing-fund-item.service';
import { BrandMarketingFundService } from '../../../../../../services/modules/category/brand-marketing-fund/brand-marketing-fund.service';
import * as config from './brand-marketing-fund-info.config';
import * as mainConfig from '../../../../../../core/_config/main.config';
import { ConfigListFactory } from '../../../../../partials/control/config-list/config-list-control.service';
import { Guid } from 'guid-typescript';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import {
  BrandMarketingFundRequestPayload
} from '../../../../../../services/modules/category/brand-marketing-fund/brand-marketing-fund.request.payload';
import { DepartmentService } from '../../../../../../services/modules/category/department/department.service';
@Component({
  selector: 'app-brand-marketing-fund-info',
  templateUrl: './brand-marketing-fund-info.component.html',
  styleUrls: ['./brand-marketing-fund-info.component.scss']
})
export class BrandMarketingFundInfoComponent extends BaseFormComponent implements OnInit {
  @ViewChild('form', { static: false }) form: NgForm;

  @Input() editTable = true;
  @Output() hasEditRow: EventEmitter<any> = new EventEmitter();

  public btnItems: MenuItem[] = [
    { label: 'Thêm', icon: 'far fa-plus', command: () => this.onBtnAddChildrenClick(this.selectedNode.data, this.selectedNode) },
    { label: 'Xóa', icon: 'pi pi-fw pi-times', command: () => this.onBtnDeleteClick(this.selectedNode.data, 1) }
  ];
  public selectedNode: any;
  public mainConfig = mainConfig.MAIN_CONFIG;
  public headers: any;
  public headerInfo: any;
  public dataSource = {
    items: null,
    paginatorTotal: undefined,
  };
  public marketingFund: any = [];
  public marketingFundItem: any = [];
  public configListDataForm: any = {};
  public configListDataStatus: any = {};
  public configListDataFisX: any = {};
  public currentBrandId: string;

  constructor(
    public brandMarketingFundService: BrandMarketingFundService,
    public brandMarketingFundItemService: BrandMarketingFundItemService,
    public departmentService: DepartmentService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    this.configData();
    const paramsSub = this.route.params.subscribe((params) => {
      if (params.id) {
        this.currentBrandId = params.id;
        this.loadNodes();
      } else {
        this.currentBrandId = null;
      }
    });
    this.subscriptions.push(paramsSub);

  }

  public configData(): void {
    this.configListDataStatus = ConfigListFactory.instant('BRAND_FUND_STATUS');
    this.configListDataFisX = ConfigListFactory.instant('BRAND_FUND_FISX');


    const tempheader = JSON.stringify(config.HEADER);
    this.headers = JSON.parse(tempheader);
    const tempheaderInfo = JSON.stringify(config.HEADER_INFO);
    this.headerInfo = JSON.parse(tempheaderInfo);
    if (!this.editTable) {
      const index = this.headers.findIndex(x => x.field === 'action');
      if (index > -1) {
        this.headers.splice(index, 1);
      }
      const indexInfo = this.headerInfo.findIndex(x => x.field === 'action');
      if (indexInfo > -1) {
        this.headerInfo.splice(indexInfo, 1);
      }
    }
  }

  public loadNodes(event?: any): void {
    const requestParent = new BrandMarketingFundRequestPayload();
    const requestChildren = new BrandMarketingFundItemRequestPayload();

    requestParent.brandId = this.currentBrandId;
    requestChildren.brandId = this.currentBrandId;

    const itemSub = forkJoin([
      this.brandMarketingFundService.select(requestParent),
      this.brandMarketingFundService.count(requestParent),
      this.brandMarketingFundItemService.select(requestChildren)
    ]).subscribe((res) => {
      this.marketingFund = res[0];
      this.dataSource.paginatorTotal = res[1];
      this.marketingFundItem = res[2];
      this.itemSourceToListTreeNode();
    });
    this.subscriptions.push(itemSub);
  }

  private itemSourceToListTreeNode(): void {
    this.dataSource.items = [];
    if (this.marketingFund && this.marketingFund.length > 0) {
      const parentItems = this.marketingFund.sort((a, b) => parseFloat(a.indexNo) - parseFloat(b.indexNo));

      for (const parent of parentItems) {
        const node = {
          data: { ...parent },
          children: [],
          expanded: false,
          leaf: true
        };

        // tslint:disable-next-line:max-line-length
        let childItems = this.marketingFundItem.filter(x => x.brandMarketingFundId === parent.id);
        for (const item of childItems) {
          item.index = item.indexNo.toString().split('.')[1];
        }
        childItems = childItems.sort((a, b) => parseFloat(a.index) - parseFloat(b.index));
        node.data.count = childItems.length;
        for (const child of childItems) {
          const childNode = {
            data: { ...child },
            leaf: true,
          };
          node.children.push(childNode);
          node.leaf = false;
        }
        if (node.children && node.children.length > 0) {
          // Add header row
          const nodeHeader = { data: { isHeaderRow: true } };
          node.children.splice(0, 0, nodeHeader);
        }

        // // Add paging row
        // const nodePaging = { data: { isPagingRow: true } };
        // node.children.push(nodePaging);

        this.dataSource.items.push(node);
      }
    }
    this.dataSource.items = [...this.dataSource.items];
    if (this.editTable) {
      this.dataSource.items.map(x => x.expanded = true);
    }
    this.cdr.detectChanges();
  }

  private quote(source: string): string {
    return `.${source}.`;
  }

  private treeNodeToItemSource(): void {
    this.marketingFund = [];
    this.marketingFundItem = [];
    for (const parentNode of this.dataSource.items) {
      this.marketingFund.push(parentNode.data);
      for (const childNode of parentNode.children) {
        if (childNode.data.id) {
          this.marketingFundItem.push(childNode.data);
        }
      }
    }
  }

  public onBtnAddChildrenClick(rowData: any, rowNode: any): void {
    const node = rowNode.node ? rowNode.node : rowNode;
    const addChil: any = { id: Guid.create().toString().split('-').join(''), brandMarketingFundId: rowData.id, isShowEditRow: true };
    for (const item of this.marketingFund) {
      item.isShowEditRow = false;
    }
    for (const item of this.marketingFundItem) {
      item.isShowEditRow = false;
    }
    if (node && node.children && node.children.length > 0) {
      const listChildren = this.marketingFundItem.filter(x => x.brandMarketingFundId === rowData.id);

      addChil.indexNo = rowData.indexNo + '.' + (listChildren.length + 1);
      this.marketingFundItem.push(addChil);
    } else {
      addChil.indexNo = rowData.indexNo + '.' + 1;
      this.marketingFundItem.push(addChil);
    }
    this.itemSourceToListTreeNode();
    this.hasEditRow.emit();
  }

  public onBtnAddParentClick(): void {
    const addItem: any = { id: Guid.create().toString().split('-').join(''), count: 0, isShowEditRow: true };
    for (const item of this.marketingFund) {
      item.isShowEditRow = false;
    }
    for (const item of this.marketingFundItem) {
      item.isShowEditRow = false;
    }
    if (this.marketingFund && this.marketingFund.length > 0) {
      addItem.indexNo = this.marketingFund.length + 1;
      this.marketingFund.push(addItem);
    } else {
      addItem.indexNo = 1;
      this.marketingFund = [];
      this.marketingFund.push(addItem);
    }
    this.itemSourceToListTreeNode();
    this.hasEditRow.emit();
  }

  public onRowEditInit(): void {
    this.hasEditRow.emit();
    this.treeNodeToItemSource();
    this.cdr.detectChanges();
  }

  public clickTrTable(rowData: any): void {
    rowData.isShowEditRow = true;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.dataSource.items.length; i++) {
      const item = this.dataSource.items[i];
      if (item.data.indexNo !== rowData.indexNo) {
        item.data.isShowEditRow = false;
      }
      if (item.children && item.children.length > 0) {
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < item.children.length; j++) {
          const children = item.children[j];
          if (children.data.indexNo !== rowData.indexNo) {
            children.data.isShowEditRow = false;
          }
        }
      }
    }
  }

  public onBtnDeleteClick(rowData: any, type: number): void {
    // 1: parent
    if (type === 1) {
      const index = this.marketingFund.findIndex(x => x.id === rowData.id);
      if (index > -1) {
        // xóa item cha
        this.marketingFund.splice(index, 1);
        // xóa item con
        if (this.marketingFundItem && this.marketingFundItem.length > 0) {
          this.marketingFundItem = this.marketingFundItem.filter(x => x.brandMarketingFundId !== rowData.id);
        }
        this.getIndexNo(rowData, 1);
      }
    }
    // 2: children
    if (type === 2) {
      const index = this.marketingFundItem.findIndex(x => x.id === rowData.id);
      if (index > -1) {
        this.marketingFundItem.splice(index, 1);
        this.getIndexNo(rowData, 2);
      }
    }
    this.itemSourceToListTreeNode();
    this.hasEditRow.emit();
  }

  private getIndexNo(rowData: any, type: number): void {
    // 1: parent   2: children
    if (type === 1 && this.marketingFund && this.marketingFund.length > 0) {
      // Đánh lại STT item cha
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.marketingFund.length; i++) {
        this.marketingFund[i].indexNo = i + 1;
        // Đánh lại STT item con
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < this.marketingFundItem.length; j++) {
          if (this.marketingFund[i].id === this.marketingFundItem[j].brandMarketingFundId) {
            // tslint:disable-next-line:max-line-length
            this.marketingFundItem[j].indexNo = this.marketingFund[i].indexNo + '.' + this.marketingFundItem[j].indexNo.toString().split('.')[1];
          }
        }
      }
    }

    if (type === 2) {
      const children = this.marketingFundItem.filter(x => x.brandMarketingFundId === rowData.brandMarketingFundId);
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < children.length; i++) {
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < this.marketingFundItem.length; j++) {
          if (children[i].id === this.marketingFundItem[j].id) {
            this.marketingFundItem[j].indexNo = rowData.indexNo.toString().split('.')[0] + '.' + (i + 1);
          }
        }
      }
    }
  }

  public onShowContextMenu() {
    this.btnItems[0].visible = this.editTable;
    this.btnItems[1].visible = this.editTable;
  }

  public onItemPagingChange(event: any, rowNode: any, rowData: any) {
    rowData.pageIndex = event.pageIndex;
    // this.getDataPaging(rowNode, event.pageIndex, event.pageSize);
  }

  public convertCurrencyMask(price: any): string {
    if (price !== null && price !== undefined) {
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

  public groupBy(xs: any[], key: string) {
    return xs.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

}
