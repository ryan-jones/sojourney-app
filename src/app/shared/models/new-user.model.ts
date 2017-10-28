import { FormControl, FormArray } from '@angular/forms';

export class NewUser {
  name: FormControl;
  username: FormControl;
  password: FormControl;
  nationalities: FormArray;

  constructor() {
    (this.name = new FormControl('')),
      (this.username = new FormControl('')),
      (this.password = new FormControl('')),
      (this.nationalities = new FormArray([]));
  }
}
