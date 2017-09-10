import { Component, OnInit } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { User } from 'app/shared/user.model';

@Component({
  selector: 'app-profile-nav',
  templateUrl: './profile-nav.component.html',
  styleUrls: ['./profile-nav.component.css']
})
export class ProfileNavComponent implements OnInit {
  user: User;

  constructor(private router: Router) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  navigateTo(id: number, path?: string) {
    path
      ? this.router.navigate(['/user', id, path])
      : this.router.navigate(['/user', id]);
  }
}
