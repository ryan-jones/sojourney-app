import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'app/shared/models/user.model';

@Component({
  selector: 'overview-nav',
  templateUrl: './overview-nav.component.html',
  styleUrls: ['./overview-nav.component.scss']
})
export class OverviewNavComponent implements OnInit {
  user: User;

  constructor(private router: Router) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  navigateTo(path: string) {
    this.router.navigate(['', path]);
  }
}
