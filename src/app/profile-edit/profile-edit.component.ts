import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {UserService} from '../user.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css'],
  providers: [UserService]
})
export class ProfileEditComponent implements OnInit {
  user: Object = {}

  originalUser: any; //user stores in user.service.ts
  editUser: any; //shown to the user to edit
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
    ) { }

  ngOnInit() {
    let user = JSON.parse(localStorage.getItem("user"))
    this.userService.get(user._id)
      .subscribe((user)=> {
        this.user = user
      });
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
