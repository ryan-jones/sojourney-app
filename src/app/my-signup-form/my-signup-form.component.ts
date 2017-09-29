import { Component, ViewChild } from '@angular/core';
import { SessionService } from '../shared/services/session.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../shared/services/user.service';
import { NewUser } from '../shared/new-user.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-my-signup-form',
  templateUrl: './my-signup-form.component.html',
  styleUrls: ['./my-signup-form.component.css'],
  providers: [SessionService]
})
export class MySignupFormComponent {
  @ViewChild('f') signupForm: NgForm
  error: string;

  constructor(
    private session: SessionService,
    private userService: UserService,
    private router: Router
  ) {}

  signup() {
    console.log('form', this.signupForm)
    // this.session.signup(this.newUser).subscribe(result => {
    //   this.router.navigate(['user']);
    // }, error => (this.error = error));
  }
}
