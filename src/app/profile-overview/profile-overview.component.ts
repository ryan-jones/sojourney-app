import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../user.service';
declare var google: any;


@Component({
  selector: 'app-profile-overview',
  templateUrl: './profile-overview.component.html',
  styleUrls: ['./profile-overview.component.css'],
  providers: [UserService]
})

export class ProfileOverviewComponent implements OnInit {
  user: Object = {};

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService) { }


  map: any;
  view;

  ngOnInit() {
    let user = JSON.parse(localStorage.getItem("user"))
    this.userService.get(user._id)
      .subscribe((user)=> {
        this.user = user
      });



    console.log('initiate', this.view);
  }


  deleteUser(){
    if (window.confirm('Are you sure?')) {
    	this.userService.remove(this.user)
      .subscribe(() => {
        this.router.navigate(['']);
      });
  	}
  }






}
