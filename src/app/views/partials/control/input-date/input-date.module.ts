import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputMaskModule } from 'primeng/inputmask';

import { InputDateComponent } from './input-date.component';

@NgModule({
    declarations: [
        InputDateComponent,
    ],
    exports: [
        InputDateComponent,

    ],
    imports: [
        CommonModule,
        FormsModule,
        InputMaskModule
    ],
    providers: []
})
export class InputDateModule {
}