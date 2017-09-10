import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css'],
  providers: [UserService]
})
export class ProfileEditComponent implements OnInit {
  user: any;

  editUser = {
    _id: '',
    name: '',
    username: '',
    password: '',
    nationality1: '',
    nationality2: ''
  }; //shown to the user to edit
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    let user = JSON.parse(localStorage.getItem('user'));
    this.userService.get(user._id).subscribe(user => {
      this.editUser = {
        _id: user._id,
        name: user.name,
        username: user.username,
        password: undefined,
        nationality1: user.nationality,
        nationality2: user.nationality2
      };
    });
  }

  editUserInfo() {
    this.userService.edit(this.editUser).subscribe(user => {
      this.user = user;
      this.router.navigate(['user', this.user.id]);
    });
  }

  deleteUser() {
    if (window.confirm('Are you sure?')) {
      this.userService.remove(this.user).subscribe(() => {
        this.router.navigate(['']);
      });
    }
  }
}
