// Anglar
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Layout Directives
// Services
import {
    ContentAnimateDirective,
    CurrencyMaskPipe,
    FirstLetterPipe,
    GetObjectPipe,
    HeaderDirective,
    JoinPipe,
    LabelPipe,
    MenuDirective,
    OffcanvasDirective,
    SafePipe,
    ScrollTopDirective,
    SparklineChartDirective,
    StickyDirective,
    TabClickEventDirective,
    TimeElapsedPipe,
    ToggleDirective,
} from './_base/layout';
import { CurrencyMaskNotDecimalPipe } from './_base/layout/pipes/currency-mask-not-decimal.pipe';

@NgModule({
    imports: [CommonModule],
    declarations: [
        // directives
        ScrollTopDirective,
        HeaderDirective,
        OffcanvasDirective,
        ToggleDirective,
        MenuDirective,
        TabClickEventDirective,
        SparklineChartDirective,
        ContentAnimateDirective,
        StickyDirective,
        // pipes
        TimeElapsedPipe,
        JoinPipe,
        GetObjectPipe,
        SafePipe,
        FirstLetterPipe,
        LabelPipe,
        CurrencyMaskPipe,
        CurrencyMaskNotDecimalPipe
    ],
    exports: [
        // directives
        ScrollTopDirective,
        HeaderDirective,
        OffcanvasDirective,
        ToggleDirective,
        MenuDirective,
        TabClickEventDirective,
        SparklineChartDirective,
        ContentAnimateDirective,
        StickyDirective,
        // pipes
        TimeElapsedPipe,
        JoinPipe,
        GetObjectPipe,
        SafePipe,
        FirstLetterPipe,
        LabelPipe,
        CurrencyMaskPipe,
        CurrencyMaskNotDecimalPipe
    ],
    providers: []
})

export class CoreModule {
}
