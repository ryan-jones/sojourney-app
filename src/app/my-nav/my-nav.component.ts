import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../shared/services/user.service';
import { User } from 'app/shared/user.model';
import { SessionService } from 'app/shared/services/session.service';

@Component({
  selector: 'app-my-nav',
  templateUrl: './my-nav.component.html',
  styleUrls: ['./my-nav.component.css']
})
export class MyNavComponent implements OnInit {

  user: User;

  constructor(
    private router: Router,
    public userService: UserService,
    public sessionService: SessionService
  ) {}

  ngOnInit() {
    console.log('isAuth?', this.sessionService.isAuth)
    this.user = JSON.parse(localStorage.getItem('user'));
    console.log('nav user', this.user)
  }

  navigateTo(route: string, id?: number) {
    id ? this.router.navigate([route, id]) : this.router.navigate([route]);
  }

  logout(){
    this.userService.logout();
  }
}
