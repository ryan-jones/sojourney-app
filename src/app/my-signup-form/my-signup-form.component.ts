import { Component } from '@angular/core';
import { SessionService } from '../shared/services/session.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../shared/services/user.service';
import { NewUser } from '../shared/new-user.model';

@Component({
  selector: 'app-my-signup-form',
  templateUrl: './my-signup-form.component.html',
  styleUrls: ['./my-signup-form.component.css'],
  providers: [SessionService]
})
export class MySignupFormComponent {
  newUser: NewUser = new NewUser;

  error: string;

  constructor(
    private session: SessionService,
    private userService: UserService,
    private router: Router
  ) {}

  signup() {
    this.session.signup(this.newUser).subscribe(result => {
      this.router.navigate(['user']);
    }, error => (this.error = error));
  }
}
