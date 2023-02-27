import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

const CODE_LENGTH = 3;

export function tuiInputCardGroupedCVCValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const {value} = control;

    if (!value?.cvc) {
      return null;
    }

    return value.cvc.length < CODE_LENGTH ? {invalidCvc: true} : null;
  };
}
