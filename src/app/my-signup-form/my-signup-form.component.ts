import { Component, ViewChild } from '@angular/core';
import { SessionService } from '../shared/services/session.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../shared/services/user.service';
import {
  NgForm,
  FormGroup,
  FormControl,
  Validators,
  FormArray
} from '@angular/forms';

@Component({
  selector: 'app-my-signup-form',
  templateUrl: './my-signup-form.component.html',
  styleUrls: ['./my-signup-form.component.css'],
  providers: [SessionService]
})
export class MySignupFormComponent {
  error: string;
  searchterm: string = '';
  newUser: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]),
    nationality: new FormArray([])
  });
  nationalities = ['United States', 'Taiwan', 'United Kingdom'];

  constructor(private session: SessionService, private router: Router) {}

  signup() {
    console.log('form', this.newUser);
    // this.session.signup(this.newUser).subscribe(result => {
    //   this.router.navigate(['user']);
    // }, error => (this.error = error));
  }

  onAddNationality(input) {
    console.log('input', input);
    const nationality = new FormControl(input);
    (<FormArray>this.newUser.get('nationality')).push(nationality);
    console.log('form', this.newUser);
  }

  filterNationalities(input) {
    console.log('nationalities', input);
    this.searchterm = input;
  }
}
