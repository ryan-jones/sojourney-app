import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {UserService} from '../user.service';


@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css'],
  providers: []
})
export class MyProfileComponent implements OnInit {

  user: any;
    formInfo = {
      username: '',
      password: ''
    };
    error: string;


  constructor(private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit() {
    let user = JSON.parse(localStorage.getItem("user"))
    this.userService.get(user._id)
      .subscribe((user)=> {
        this.user = user
      });
  }


}
