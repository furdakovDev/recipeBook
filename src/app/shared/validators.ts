import { FormControl } from '@angular/forms';

export const noNegativeValidator = (control: FormControl): {[s: string]: boolean} => {
  if (typeof control.value === 'number' && control.value < 1) {
    return {
      isNegative: true
    };
  }
  return null;
};
