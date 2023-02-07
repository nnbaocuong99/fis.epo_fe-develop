import { HostListener, OnDestroy } from '@angular/core';
import { AfterContentInit, Directive, ElementRef, HostBinding, Input, NgZone } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Tooltip } from 'primeng/tooltip';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[validateTooltip]'
})

export class ValidateTooltipDirective implements AfterContentInit, OnDestroy {
    private _controlName: string;
    private _isError = false;
    private _el: ElementRef;
    @Input() validateForm: NgForm;
    @Input() name: string;
    @HostBinding('attr.pTooltip') pTooltip: Tooltip;
    @HostListener('focus')
    setInputFocus(): void {
        if (this._el.nativeElement.contains(document.activeElement)) {
            this.pTooltip.show();
        }
    }
    @HostListener('onFocus')
    setInputOnFocus(): void {
        if (this._el.nativeElement.contains(document.activeElement)) {
            this.pTooltip.show();
        }
    }
    @HostListener('blur')
    setInputBlur(): void {
        if (!this._el.nativeElement.contains(document.activeElement)) {
            this.pTooltip.hide();
        }
    }
    @HostListener('onBlur')
    setInputOnBlur(): void {
        if (!this._el.nativeElement.contains(document.activeElement)) {
            this.pTooltip.hide();
        }
    }

    constructor(el: ElementRef, zone: NgZone, public translate: TranslateService) {
        this.pTooltip = new Tooltip(el, zone);
        this._el = el;
        // tslint:disable-next-line:no-unused-expression
        new ClassWatcher(this, el.nativeElement, 'ng-invalid', this.workOnClassAdd, this.workOnClassRemoval);
    }

    workOnClassAdd(context: ValidateTooltipDirective) {
        context._isError = true;
        context.resetValue();
    }

    workOnClassRemoval(context: ValidateTooltipDirective) {
        context._isError = false;
        context.resetValue();
    }

    ngAfterContentInit() {
        this.pTooltip.tooltipEvent = 'focus';
        this.pTooltip.tooltipZIndex = '999998';
        this.pTooltip.tooltipStyleClass = 'error-tooltip';
        this.pTooltip.ngAfterViewInit();
        if (this._el.nativeElement.name) {
            this._controlName = this._el.nativeElement.name;
        } else {
            this._controlName = this.name;
        }
        document.addEventListener('mousewheel', this.hideTooltip);
    }

    ngOnDestroy() {
        document.removeEventListener('mousewheel', this.hideTooltip);
    }

    private hideTooltip = () => {
        if (this.pTooltip) {
            this.pTooltip.hide();
        }
    }

    private resetValue() {
        this.pTooltip.disabled = !this._isError;
        if (this._isError) {
            let message = '';
            if (this.getShowError()[0]) {
                const messKey = 'VALIDATION.' + this.getShowError()[0].toUpperCase();
                message = this.translate.instant(messKey);
            } else {
                message = this.translate.instant('VALIDATION.ERROR_OCCURRED');
            }

            this.pTooltip.text = message;
            if (this._el.nativeElement.classList.contains('ng-dirty') && this._el.nativeElement.contains(document.activeElement)) {
                setTimeout(() => {
                    this.pTooltip.show();
                }, 0);
            }
        } else {
            this.hideTooltip();
        }
    }

    private getShowError(): string[] {
        // tslint:disable-next-line:max-line-length
        if (!this.validateForm || !this.validateForm.form || !this.validateForm.form.controls[this._controlName] || !this.validateForm.form.controls[this._controlName].errors) {
            return [];
        }
        return Object.keys(this.validateForm.form.controls[this._controlName].errors);
    }
}

export class ClassWatcher {
    public context: any;
    public targetNode: any;
    public classToWatch: any;
    public classAddedCallback: any;
    public classRemovedCallback: any;
    public observer: any;
    public lastClassState: any;
    constructor(context: any, targetNode: any, classToWatch: any, classAddedCallback: any, classRemovedCallback: any) {
        this.context = context;
        this.targetNode = targetNode;
        this.classToWatch = classToWatch;
        this.classAddedCallback = classAddedCallback;
        this.classRemovedCallback = classRemovedCallback;
        this.observer = null;
        this.lastClassState = targetNode.classList.contains(this.classToWatch);
        this.init();
    }

    public init() {
        this.observer = new MutationObserver(this.mutationCallback);
        this.observe();
    }

    public observe() {
        this.observer.observe(this.targetNode, { attributes: true });
    }

    public disconnect() {
        this.observer.disconnect();
    }

    public mutationCallback = (mutationsList: any) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const currentClassState = mutation.target.classList.contains(this.classToWatch);
                if (this.lastClassState !== currentClassState) {
                    this.lastClassState = currentClassState;
                    if (currentClassState) {
                        this.classAddedCallback(this.context);
                    } else {
                        this.classRemovedCallback(this.context);
                    }
                }
            }
        }
    }
}
