import { Component, OnInit } from '@angular/core';
import {UserService} from '../shared/services/user.service';

import { MapStyles, MapOptions } from '../shared/map.model';
import { setMap } from 'app/shared/services/map.service';

declare const google: any;

@Component({
  selector: 'app-profile-country-visit',
  templateUrl: './profile-country-visit.component.html',
  styleUrls: ['./profile-country-visit.component.css']
})
export class ProfileCountryVisitComponent implements OnInit {

  constructor(
    private userService: UserService, ) { }

  map: any;

  ngOnInit() {
    this.initiateMap();
  }

  initiateMap(){
    this.map = setMap();
  }
}
