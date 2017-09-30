import { FormControl } from '@angular/forms';

export class NewUser {
  name: FormControl;
  username: FormControl;
  password: FormControl;
  nationality: FormControl;
  nationality2: FormControl;

  constructor() {
    (this.name = new FormControl('')),
      (this.username = new FormControl('')),
      (this.password = new FormControl('')),
      (this.nationality = new FormControl('')),
      (this.nationality2 = new FormControl(''));
  }
}
