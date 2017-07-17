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
  user: any;

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService) { }


  ngOnInit() {
    this.user = {};

    let user = JSON.parse(localStorage.getItem("user"))
    console.log('THE ID', user)
    if (user === null){
      this.user = ''
    } else {
      this.userService.get(user._id)
        .subscribe((user)=> {

              this.user = user
              console.log('this.user', this.user);
            });
  }
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
