import { Component } from '@angular/core';
import { SessionService } from '../shared/services/session.service';
import { UserService } from '../shared/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-login',
  templateUrl: './my-login.component.html',
  styleUrls: ['./my-login.component.css']
})
export class MyLoginComponent {
  user = {
    username: '',
    password: ''
  };

  error: string;

  constructor(
    private router: Router,
    private session: SessionService,
    private userService: UserService
  ) {}

  login() {
    this.session.login(this.user).subscribe(result => {
      if (result) {
        console.log('result', result)
        this.router.navigate(['user', result._id],);
      } else {
        this.error = 'Username or password is incorrect';
      }
    });
  }

  goToSignup() {
    this.router.navigate(['signup']);
  }

  logout() {
    this.session.logout();
  }
}
