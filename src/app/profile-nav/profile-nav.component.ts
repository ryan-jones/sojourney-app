import { Component, OnInit } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { SessionService } from '../session.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile-nav',
  templateUrl: './profile-nav.component.html',
  styleUrls: ['./profile-nav.component.css']
})
export class ProfileNavComponent implements OnInit {
  user: any;
  constructor(
    private router: Router,
    private session: SessionService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.user = {};
    let user = JSON.parse(localStorage.getItem('user'));
    if (user === null) {
      this.user = '';
    } else {
      this.userService.get(user._id).subscribe(user => {
        this.user = user;
      });
    }
  }

  goToOverview() {
    this.router.navigate(['/user']);
  }

  goToEdit(id: number) {
    this.router.navigate(['/user', id, 'edit']);
  }

  goToItinerary(id: number) {
    this.router.navigate(['user', id, '/itineraries']);
  }

  goToCountryView(id: number) {
    this.router.navigate(['/user', id, '/countries_visited']);
  }
}
