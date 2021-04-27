import { AbstractControl, FormGroup } from '@angular/forms';

export function httpsUrlValidador(control: AbstractControl) {
  if (!control.value.startsWith('https')) {
    return { urlValid: true };
  }
  return null;
}

export function MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return si algun otro validador encontro un error en matchingControl
            return;
        }

        // establecer error en matchingControl si la validacion falla
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    };
}
