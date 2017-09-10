import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../shared/services/session.service';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-my-nav',
  templateUrl: './my-nav.component.html',
  styleUrls: ['./my-nav.component.css']
})
export class MyNavComponent implements OnInit {
  user: any;

  constructor(
    private router: Router,
    public session: SessionService,
    private userService: UserService
  ) {}

  ngOnInit() {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (!currentUser) {
      this.user.name = '';
    } else {
      this.userService.get(currentUser._id).subscribe(user => {
        this.user = user;
        console.log('user', this.user);
      });
    }
  }

  goToAbout() {
    this.router.navigate(['about']);
  }

  goToLogin() {
    this.router.navigate(['login']);
  }

  goToHome() {
    this.router.navigate(['home']);
  }

  goToSignup() {
    this.router.navigate(['signup']);
  }

  goToUser(id: number) {
    this.router.navigate(['user', id]);
  }

  goToFlight() {
    this.router.navigate(['flights']);
  }

  logout() {
    this.session.logout();
  }
}
