import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../shared/services/user.service';
import { User } from 'app/shared/user.model';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css'],
  providers: [UserService]
})
export class ProfileEditComponent implements OnInit {
  user: User = new User();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user'));
    this.user = Object.assign({}, user);
    this.user.password = undefined;
  }

  editUserInfo() {
    this.userService.editUser(this.user).subscribe(user => {
      this.user = user;
      this.router.navigate(['user', this.user._id]);
    });
  }

  deleteUser() {
    if (window.confirm('Are you sure?')) {
      this.userService.deleteUser(this.user).subscribe(() => {
        this.router.navigate(['']);
      });
    }
  }
}
