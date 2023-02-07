// import { Provider, forwardRef, Directive } from '@angular/core';
// import { FormControl, NG_ASYNC_VALIDATORS, AsyncValidator } from '@angular/forms';
// import { PeriodService } from 'src/app/Modules/MPeriod/period.service';
// import { PeriodSearchEntity } from 'src/app/Modules/MPeriod/period.search-entity';
// import { map } from 'rxjs/operators';

// export const PERIOD_VALIDATOR: Provider = {
//     provide: NG_ASYNC_VALIDATORS,
//     useExisting: forwardRef(() => PeriodValidatorDirective),
//     multi: true
// };

// @Directive({
//     selector: '[appPeriodValidator]',
//     providers: [
//         PERIOD_VALIDATOR
//     ]
// })

// export class PeriodValidatorDirective implements AsyncValidator {
//     constructor(
//         private periodService: PeriodService
//     ) { }
//     validate(control: FormControl) {
//         const searchEntity: PeriodSearchEntity = new PeriodSearchEntity();
//         return this.periodService.Get(searchEntity).pipe(map(response => {
//             if (response.length !== 0) {
//                 return null;
//             } else {
//                 return { periodError: true };
//             }
//         }));
//     }
// }
