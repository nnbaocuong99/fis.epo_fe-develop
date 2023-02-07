import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { TreeTableModule } from 'primeng/treetable';
import { PartialsModule } from '../../partials.module';
import { AttachDocumentComponent } from './attach-document.component';

@NgModule({
    declarations: [
        AttachDocumentComponent
    ],
    exports: [
        AttachDocumentComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        TreeTableModule,
        TranslateModule,
        MatCheckboxModule,
        PartialsModule
    ]
})
export class AttachDocumentModule {
}