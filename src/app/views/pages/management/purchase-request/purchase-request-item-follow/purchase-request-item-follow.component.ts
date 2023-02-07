import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import * as config from './purchase-request-item-follow.config';
import * as mainConfig from '../../../../../core/_config/main.config';
import { BaseFormComponent } from '../../../../../core/_base/component/base-form.component';
import { PurchaseInvoiceItemRequestPayload } from '../../../../../services/modules/purchase-invoice-item/purchase-invoice-item.request-payload';
import { PurchaseRequestItemRequestPayload } from '../../../../../services/modules/purchase-request-item/purchase-request-item.request-payload';
import { PurchaseOrderItemRequestPayload } from '../../../../../services/modules/purchase-order-item/purchase-order-item.request-payload';
import { PurchaseRequestItemService } from '../../../../../services/modules/purchase-request-item/purchase-request-item.service';
import { PurchaseOrderItemService } from '../../../../../services/modules/purchase-order-item/purchase-order-item.service';
import { PurchaseInvoiceItemService } from '../../../../../services/modules/purchase-invoice-item/purchase-invoice-item.service';
import { forkJoin } from 'rxjs';
import { ShipmentItemService } from '../../../../../services/modules/shipment-item/shipment-item.service';
import { ShipmentItemRequestPayload } from '../../../../../services/modules/shipment-item/shipment-item.request-payload';

@Component({
  selector: 'app-purchase-request-item-follow',
  templateUrl: './purchase-request-item-follow.component.html',
  styleUrls: ['./purchase-request-item-follow.component.scss']
})
export class PurchaseRequestItemFollowComponent extends BaseFormComponent implements OnInit {
  @Input() purchaseRequestData: any = {};
  @Input() allowViewPrice: boolean = false;

  public headerItemsFollow = config.HEADER_ITEMS_FOLLOW;
  public dataSource = {
    items: [],
    paginatorTotal: undefined
  };
  public statusImportGoods = config.STATUS_IMPORT_GOODS;

  constructor(
    private cdr: ChangeDetectorRef,
    public purchaseRequestItemService: PurchaseRequestItemService,
    public purchaseOrderItemService: PurchaseOrderItemService,
    public purchaseInvoiceItemService: PurchaseInvoiceItemService,
    public shipmentItemService: ShipmentItemService
  ) {
    super();
  }

  ngOnInit() {
    this.loadData();
  }

  public loadData() {
    if (this.purchaseRequestData.id) {
      this.dataSource.items = [];
      let listPri = [];
      let listPoi = [];
      let listPii = [];
      let listSi = [];

      const requestPrItem = new PurchaseRequestItemRequestPayload();
      requestPrItem.prId = this.purchaseRequestData.id;
      this.purchaseRequestItemService.select(requestPrItem).subscribe(resPri => {
        listPri = resPri;
        const requestPoItem: any = new PurchaseOrderItemRequestPayload();
        requestPoItem.listPrItemId = listPri.map(({ id }) => id);
        this.purchaseOrderItemService.selectPost(requestPoItem).subscribe(resPoi => {
          listPoi = resPoi;
          const requestPiItem = new PurchaseInvoiceItemRequestPayload();
          requestPiItem.listPoItemId = listPoi.map(({ id }) => id);
          this.purchaseInvoiceItemService.selectFollowPr(requestPiItem).subscribe(resPii => {
            listPii = resPii;
            const requestSi = new ShipmentItemRequestPayload();
            requestSi.listPiItemId = listPii.map(({ id }) => id);
            this.shipmentItemService.selectFollowPr(requestSi).subscribe(resSi => {
              listSi = resSi;
              this.loadNodesItemsFollow(listPri, listPoi, listPii, listSi);
            });
          });
        });
      });
    }
  }

  public loadNodesItemsFollow(listPri: any, listPoi: any, listPii: any, listSi: any) {
    if (listPri.length > 0) {
      const parentItems = listPri.sort((a, b) => parseFloat(a.indexNo) - parseFloat(b.indexNo));
      parentItems.forEach((parent, index) => {
        const node = {
          data: {
            ...parent,
            indexNo: (index + 1),
            countQuantityPo: 0,
            countQuantityPi: 0
          },
          children: [],
          listPoCodeParent: [],
          listPiCodeParent: [],
          listShipmentParent: [],
          expanded: false,
          leaf: true,
        };
        const childItems = listPoi.filter(x => x.prItemId === parent.id);
        let count = 0;
        childItems.forEach((child, indexChild) => {
          count = count + 1;
          const listPiiTemp = listPii.filter(x => x.poItemId === child.id);
          const listSiTemp = listSi.filter(x => x.poItemId === child.id);
          const childNode = {
            data: {
              ...child,
              ipoNumber: parent.ipoNumber,
              indexNo: ((index + 1) + '.' + count),
              listPii: listPiiTemp,
              listSi: listSiTemp,
              countQuantityPo: child.quantity,
              countQuantityPi: 0
            },
            leaf: true,
          };
          if (child.poCode) {
            node.listPoCodeParent.push(child.poCode);
          }
          if (listPiiTemp.length > 0) {
            for (const piiTemp of listPiiTemp) {
              childNode.data.countQuantityPi += piiTemp.quantity ? piiTemp.quantity : 0;
              if (!node.listPiCodeParent.some(m => m === piiTemp.piCode)) {
                node.listPiCodeParent.push(piiTemp.piCode);
              }
            }
          }
          if (listSiTemp.length > 0) {
            for (const siTemp of listSiTemp) {
              if (!node.listShipmentParent.some(m => m === siTemp.waybillNumber)) {
                node.listShipmentParent.push(siTemp.waybillNumber);
              }
            }
          }
          node.data.countQuantityPo += childNode.data.countQuantityPo;
          node.data.countQuantityPi += childNode.data.countQuantityPi;
          node.children.push(childNode);
          node.leaf = false;
        });
        node.data.poCodeParent = node.listPoCodeParent.join(', ');
        node.data.piCodeParent = node.listPiCodeParent.join(', ');
        node.data.waybillNumberParent = node.listShipmentParent.join(', ');
        this.dataSource.items.push(node);
      });
      this.dataSource.items = [...this.dataSource.items];
      this.cdr.detectChanges();
    }
  }
}
