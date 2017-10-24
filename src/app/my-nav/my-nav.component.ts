import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'app/shared/user.model';
import { SessionService } from 'app/shared/services/session.service';
import { UserService } from '../shared/services/user.service';


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
    private sessionService: SessionService
  ) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  navigateTo(route: string, id?: number) {
    id ? this.router.navigate([route, id]) : this.router.navigate([route]);
  }

  logout(){
    this.userService.logout();
  }
}
