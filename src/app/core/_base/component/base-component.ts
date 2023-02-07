import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

export class BaseComponent implements OnDestroy {
    public subscriptions: Subscription[] = [];
    ngOnDestroy() {
        this.subscriptions.forEach(el => el.unsubscribe());
    }

    parseDate(dateString: string): any {
        if (dateString) {
            // return new Date(dateString);
            return dateString;
        }
        return null;
    }

    public toDto(property: string, value: string): any {
        if (value) {
            const obj = {};
            obj[property] = value;
            return obj;
        } else {
            return null;
        }
    }

    public toCamelCase(str) {
        // tslint:disable-next-line:only-arrow-functions
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
          return index === 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, '');
      }
}
