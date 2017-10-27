import { Component, OnInit } from '@angular/core';
import { MapStyles, MapOptions } from '../../../shared/map.model';
import { User } from 'app/shared/user.model';
import { setMap } from 'app/utils';

declare const google: any;

@Component({
  selector: 'app-profile-country-visit',
  templateUrl: './profile-country-visit.component.html',
  styleUrls: ['./profile-country-visit.component.css']
})
export class ProfileCountryVisitComponent implements OnInit {
  constructor() {}

  user: User;
  map: any;

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.initiateMap();
  }

  initiateMap() {
    this.map = setMap();
  }
}
