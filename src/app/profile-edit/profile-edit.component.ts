import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {
  originalUser: any; //user stores in user.service.ts
  editUser: any; //shown to the user to edit
  constructor(private route: ActivatedRoute,
    ) { }

  ngOnInit() {
  }
  // save(){this.originalUser = this.userService.edit(this.editUser);}
}
