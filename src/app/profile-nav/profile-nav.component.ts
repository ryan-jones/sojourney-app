import { Component, OnInit } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { SessionService } from '../shared/services/session.service';
import { UserService } from '../shared/services/user.service';
import { User } from 'app/shared/user.model';

@Component({
  selector: 'app-profile-nav',
  templateUrl: './profile-nav.component.html',
  styleUrls: ['./profile-nav.component.css']
})
export class ProfileNavComponent implements OnInit {
  
  user: User = new User;

  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.userService.get(user._id).subscribe(user => {
        this.user = Object.assign({}, user);
      });
    }
  }

  goToOverview(id: number) {
    this.router.navigate(['/user', id ]);
  }

  goToEdit(id: number) {
    this.router.navigate(['/user', id, 'edit']);
  }

  goToItineraries(id: number) {
    this.router.navigate(['/user', id, 'itineraries']);
  }

  goToCountriesView(id: number) {
    this.router.navigate(['/user', id, 'countries_visited']);
  }
}
