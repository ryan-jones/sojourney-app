import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { SessionService } from '../session.service';
import {UserService} from '../user.service';

@Component({
  selector: 'app-my-nav',
  templateUrl: './my-nav.component.html',
  styleUrls: ['./my-nav.component.css']
})
export class MyNavComponent implements OnInit {
  user: Object = {};

  constructor(
    private router: Router,
    public session: SessionService,
    private userService: UserService,
  ) { }

  ngOnInit() {

    let user = JSON.parse(localStorage.getItem("user"))
    console.log('THE ID', user)
    if (user === null){
      this.user = ''
    } else {
      this.userService.get(user._id)
        .subscribe((user)=> {

              this.user = user
            });

        }



  }

  goToAbout(){
      this.router.navigate(['about']);
    }

    goToLogin(){
      this.router.navigate(['login']);
    }

    goToHome(){
      this.router.navigate(['home']);
    }

    goToSignup(){
      this.router.navigate(['signup']);
    }

    goToUser(){
      this.router.navigate(['user']);
    }

    goToFlight(){
      this.router.navigate(['flights']);
    }

    logout(){
      this.session.logout();
    }
}
