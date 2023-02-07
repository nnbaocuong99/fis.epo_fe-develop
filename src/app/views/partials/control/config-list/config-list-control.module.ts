import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { NotificationModule } from '../../../../services/common';
import { ConfigListService } from '../../../../services/modules/config-list/config-list.service';
import { ConfigListControlComponent } from './config-list-control.component';
import { ConfigListLoader, TOKEN } from './config-list-control.service';
import { ConfigListDialogComponent } from './config-list-dialog/config-list-dialog.component';

@NgModule({
    declarations: [
        ConfigListDialogComponent,
        ConfigListControlComponent,
    ],
    exports: [
        ConfigListDialogComponent,
        ConfigListControlComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        DialogModule,
        MatFormFieldModule,
        TableModule,
        MatCheckboxModule,
        MatInputModule,
        NotificationModule
    ],
    providers: []
})

export class ConfigListModule {
    static forChild(source: string[]): ModuleWithProviders {
        return {
            ngModule: ConfigListModule,
            providers: [
                {
                    provide: ConfigListLoader,
                    useFactory: configListFactory,
                    deps: [ConfigListService, Router, TOKEN]
                },
                {
                    provide: TOKEN,
                    useValue: source
                }
            ]
        };
    }
}

export function configListFactory(http: ConfigListService, router: Router, source: string[]): ConfigListLoader {
    return new ConfigListLoader(http, router, source);
}
