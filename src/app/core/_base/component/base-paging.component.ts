import { OnDestroy, OnInit } from "@angular/core";
import { BaseComponent } from "./base-component";

export class BasePagingComponent extends BaseComponent implements OnInit, OnDestroy {
    /**
     * When init component
     */
    ngOnInit() {
    }

    /**
     * When destroy component
     */
    ngOnDestroy() {
        this.subscriptions.forEach(el => el.unsubscribe());
    }
}