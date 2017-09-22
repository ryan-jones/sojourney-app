import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { jwtDecode } from 'jwt-decode';

@Injectable()
export class SessionService implements CanActivate {
  public token: string;
  public isAuth: boolean;
  public user: string;

  BASE_URL: string = 'https://sojourney.herokuapp.com';
  // BASE_URL: string = 'http://localhost:3000';
  constructor(private router: Router, private http: Http) {
    // set token if saved in local storage
    this.token = localStorage.getItem('token');
    this.isAuth = this.token ? true : false;
  }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.user = jwtDecode(this.token).user;
      this.isAuth = true;
      return true;
    }
    // not logged in so redirect to login page
    this.router.navigate(['/login']);
    this.isAuth = false;
    return false;
  }

  isAuthenticated() {
    return this.token ? true : false;
  }

  signup(user) {
    return this.http
      .post(`${this.BASE_URL}/signup`, user)
      .map((response: Response) => {
        const token = response.json() && response.json().token;
        const user = response.json() && response.json().user;
        this.checkForToken(token, user);
      });
  }

  login(user) {
    return this.http
      .post(`${this.BASE_URL}/login`, user)
      .map((response: Response) => {
        // login successful if there's a jwt token in the response
        const token = response.json() && response.json().token;
        const user = response.json() && response.json().user;
        this.checkForToken(token, user);
      });
  }

  checkForToken(token, user) {
    if (token) {
      this.token = token;
      this.isAuth = true;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    } else {
      // return false to indicate failed login
      return false;
    }
  }

  logout() {
    this.token = null;
    this.user = null;
    this.isAuth = false;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['']);
  }
}
