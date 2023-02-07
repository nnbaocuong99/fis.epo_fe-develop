import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PartialsModule } from '../../partials/partials.module';
import { CoreModule } from '../../../core/core.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'shipment',
        loadChildren: () => import('../management/shipment/shipment.module').then(m => m.ShipmentModule)
    },
    {
        path: 'purchase-plan',
        loadChildren: () => import('../management/purchase-plan/purchase-plan.module').then(m => m.PurchasePlanModule)
    },
    {
        path: 'purchase-order',
        loadChildren: () => import('../management/purchase-order/purchase-order.module').then(m => m.PurchaseOrderModule)
    },
    {
        path: 'purchase-request',
        loadChildren: () => import('../management/purchase-request/purchase-request.module').then(m => m.PurchaseRequestModule)
    },
    {
        path: 'purchase-invoice',
        loadChildren: () => import('../management/purchase-invoice/purchase-invoice.module').then(m => m.PurchaseInvoiceModule)
    },
    {
        path: 'import-goods',
        loadChildren: () => import('../management/import-goods/import-goods.module').then(m => m.ImportGoodsModule)
    },
    {
        path: 'license-conformity',
        loadChildren: () => import('../management/license-conformity/license-conformity.module').then(m => m.LicenseConformityModule)
    },
    {
        path: 'tax-invoice',
        loadChildren: () => import('../management/tax-invoice/tax-invoice.module').then(m => m.TaxInvoiceModule)
    }, {
        path: 'payment-order',
        loadChildren: () => import('../management/payment-order/payment-order.module').then(m => m.PaymentOrderModule)
    }
];

@NgModule({
    declarations: [],
    exports: [],
    imports: [
        CommonModule,
        FormsModule,
        CoreModule,
        RouterModule.forChild(routes),
        PartialsModule
    ],
    providers: [],
    entryComponents: [],
})

export class ManagementModule { }
