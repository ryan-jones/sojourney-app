import { Component, OnInit, AfterViewInit } from '@angular/core';
import { User } from 'app/shared/models/user.model';
import { setMap } from 'app/utils';

@Component({
  selector: 'app-profile-country-visit',
  templateUrl: './profile-country-visit.component.html',
  styleUrls: ['./profile-country-visit.component.scss']
})
export class ProfileCountryVisitComponent implements OnInit, AfterViewInit {
  constructor() {}

  user: User;
  map: any;

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  ngAfterViewInit() {
    this.map = setMap();
  }
}
