import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { User } from 'app/shared/user.model';
import { SessionService } from 'app/shared/services/session.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {
  user: User = new User();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private sessionService: SessionService
  ) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user'));
    this.user = Object.assign({}, user);
    this.user.password = undefined;
  }

  editUserInfo() {
    this.userService.editUser(this.user).subscribe(user => {
      this.user = user;
    });
  }

  deleteUser() {
    this.userService.deleteUser(this.user._id).subscribe(res => {
      if (res) this.sessionService.resetTokens();
      this.router.navigate(['']);
    });
  }
}
