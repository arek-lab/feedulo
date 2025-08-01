import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function phoneNumberValidator(): ValidatorFn {
  const pattern = /^\+48\d{9}$|^\d{9}$/;

  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    // Przepuszczamy pusty string, null i undefined
    if (value === null || value === undefined || value === '') {
      return null;
    }

    // Jeśli nie pasuje do wzorca, zwróć błąd
    return pattern.test(value) ? null : { phoneNumberInvalid: true };
  };
}
