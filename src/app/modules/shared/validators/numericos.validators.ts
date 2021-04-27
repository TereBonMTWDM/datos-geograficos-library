import { AbstractControl } from '@angular/forms';

function rangoEdadPermitida(control: AbstractControl): { [key: string]: boolean } | null {
    if (control.value !== undefined && (isNaN(control.value) || control.value < 18 || control.value > 50)) {
        return { rangoEdad: true };
    }
    return null;
}
