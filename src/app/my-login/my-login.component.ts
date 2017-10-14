import { Component } from '@angular/core';
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
    private userService: UserService
  ) {}

  login() {
    this.userService.login(this.user).subscribe(result => {
      result
        ? this.router.navigate(['user', result._id])
        : (this.error = 'Username or password is incorrect');
    });
  }

  goToSignup() {
    this.router.navigate(['signup']);
  }

  logout() {
    this.userService.logout();
  }
}
