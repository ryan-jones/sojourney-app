import { Component, OnInit } from '@angular/core';
import { SessionService } from '../session.service';
import { Router, ActivatedRoute } from '@angular/router';
import{ UserService} from '../user.service';


@Component({
  selector: 'app-my-signup-form',
  templateUrl: './my-signup-form.component.html',
  styleUrls: ['./my-signup-form.component.css'],
  providers: [SessionService]
})
export class MySignupFormComponent implements OnInit {

  newUser = {
    name: '',
    username: '',
    password: '',
    nationality: '',
    nationality2: ''
  };

  user: any;
  error: string;

  constructor(
  	private session: SessionService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    }

  signup() {
  	this.session.signup(this.newUser)
      .subscribe(result => {
          if (result === true) {
            this.router.navigate(['user'])
          } else {
              alert('Uh oh! Looks like something went wrong')
          }
      });
  }
}
