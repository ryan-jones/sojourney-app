import { Component } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-my-login',
  templateUrl: './my-login.component.html',
  styleUrls: ['./my-login.component.css']
})
export class MyLoginComponent {
  user: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]),
  });

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
