import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatMenuModule, MatPaginatorModule, MatProgressSpinnerModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { InputContractComponent } from './input-contract.component';
import { ListContractComponent } from './list-contract/list-contract.component';

@NgModule({
    declarations: [
        InputContractComponent,
        ListContractComponent
    ],
    exports: [
        InputContractComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        DialogModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatMenuModule,
        TranslateModule,
        TableModule
    ],
    providers: []
})

export class InputContractModule {
}
