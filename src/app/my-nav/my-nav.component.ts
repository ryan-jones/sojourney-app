import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../shared/services/session.service';
import { UserService } from '../shared/services/user.service';
import { User } from 'app/shared/user.model';

@Component({
  selector: 'app-my-nav',
  templateUrl: './my-nav.component.html',
  styleUrls: ['./my-nav.component.css']
})
export class MyNavComponent implements OnInit {

  user: User;

  constructor(
    private router: Router,
    public session: SessionService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  navigateTo(route: string, id?: number) {
    id ? this.router.navigate([route, id]) : this.router.navigate([route]);
  }

  logout(){
    this.session.logout();
  }
}
