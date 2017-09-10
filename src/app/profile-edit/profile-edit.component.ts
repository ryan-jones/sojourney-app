import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../shared/services/user.service';
import { NewUser } from 'app/shared/new-user.model';
import { User } from 'app/shared/user.model';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css'],
  providers: [UserService]
})
export class ProfileEditComponent implements OnInit {
  
  user: any;

  editUser: User = new User();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user'));
    this.userService.get(user._id).subscribe(user => {
      this.editUser = Object.assign({},user);
      this.editUser.password = undefined;
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
