import { Component, OnInit } from '@angular/core';
import { User } from 'app/shared/user.model';

@Component({
  selector: 'app-profile-overview',
  templateUrl: './profile-overview.component.html',
  styleUrls: ['./profile-overview.component.css'],
})
export class ProfileOverviewComponent implements OnInit {
  
  user: User;

  constructor(
  ) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
  }

}
