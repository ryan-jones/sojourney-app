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
  user: any;

  editUser = {
    name: '',
    username: '',
    password: '',
    nationality1: '',
    nationality2: '',
  } //shown to the user to edit
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
    ) { }

  ngOnInit() {
    this.user = {}
    let user = JSON.parse(localStorage.getItem("user"))
    this.userService.get(user._id)
      .subscribe((user)=> {
        this.user = user
      });
  }

  editUserInfo(){
    this.user = this.editUser;
    this.userService.edit(this.user)
      .subscribe((user)=>{
        alert('subscribed!')
        this.user = user;
        this.router.navigate(['user']);
      })
  }

  deleteUser(){
    if (window.confirm('Are you sure?')) {

    	this.userService.remove(this.user)
      .subscribe(() => {
        alert('user deleted')
        this.router.navigate(['']);
      });
  	}
  }
}
