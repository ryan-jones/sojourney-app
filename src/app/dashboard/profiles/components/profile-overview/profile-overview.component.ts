import { Component, OnInit } from '@angular/core';
import { User } from 'app/shared/models/user.model';

@Component({
  selector: 'app-profile-overview',
  templateUrl: './profile-overview.component.html',
  styleUrls: ['./profile-overview.component.scss'],
})
export class ProfileOverviewComponent implements OnInit {
  
  user: User;

  constructor(
  ) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
  }

}
