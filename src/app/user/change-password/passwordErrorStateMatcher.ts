import { AbstractControl, FormGroupDirective, NgForm } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";

export class PasswordErrorStateMatcher  implements ErrorStateMatcher{
  isErrorState(control: AbstractControl<any, any> | null, form: FormGroupDirective | NgForm | null): boolean {
   const newPass = !!(control && control.invalid && control.parent?.dirty);
   const passWider = !!(control && control.parent && control.valid && control.parent.dirty);
   return (newPass || passWider);
  }

}
