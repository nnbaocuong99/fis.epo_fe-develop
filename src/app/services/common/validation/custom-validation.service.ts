import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CustomvalidationService {

  // userNameValidator(userControl: AbstractControl) {
  //   return new Promise(resolve => {
  //     setTimeout(() => {
  //       if (this.validateUserName(userControl.value)) {
  //         resolve({ userNameNotAvailable: true });
  //       } else {
  //         resolve(null);
  //       }
  //     }, 0);
  //   });
  // }

  // validateUserName(userName: string) {
  //   const UserList = ['ankit', 'admin', 'user', 'superuser'];
  //   return (UserList.indexOf(userName) > -1);
  // }

  // Validat email
  patternValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
      const regex = new RegExp('^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$');
      const valid = regex.test(control.value);
      return valid ? null : { invalidEmail: true };
    };
  }
}