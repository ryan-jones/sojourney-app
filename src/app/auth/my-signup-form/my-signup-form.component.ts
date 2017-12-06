import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
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
  styleUrls: ['./my-signup-form.component.scss'],
})
export class MySignupFormComponent {
  @ViewChild('nationality') nationalityInput;
  error: string;
  searchterm = '';
  newUser: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]),
    nationalities: new FormArray([])
  });
  nationalities = ['United States', 'Taiwan', 'United Kingdom'];
  selectedNationalities: string[] = [];

  constructor(private session: UserService, private router: Router) {}

  signup() {
    this.session.signup(this.newUser).subscribe(
      result => {
        if (result) this.router.navigate(['user', result._id]);
      },
      error => {
        this.error = error;
      }
    );
  }

  onAddNationality(input) {
    const nationality = new FormControl(input);
    (<FormArray>this.newUser.get('nationalities')).push(nationality);
    this.selectedNationalities.push(input);
    this.resetValues();
  }

  filterNationalities(input) {
    this.searchterm = input;
  }

  resetValues() {
    this.nationalityInput.nativeElement.value = '';
    this.searchterm = '';
  }

  onDeleteNationalityFromList(nationality) {
    const nationalities = <FormArray>this.newUser.controls['nationalities'];
    nationalities.controls = nationalities.controls.filter(control => {
      return control.value !== nationality;
    });
    this.selectedNationalities = this.selectedNationalities.filter(country => {
      return country !== nationality;
    });
  }
}
