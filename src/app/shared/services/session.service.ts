import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as jwtDecode from 'jwt-decode';

@Injectable()
export class SessionService implements CanActivate {
  public token: string;
  public isAuth: boolean;
  public user: string;

  // BASE_URL: string = 'https://sojourney.herokuapp.com';
  BASE_URL: string = 'http://localhost:3000';
  constructor(private router: Router, private http: Http) {
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
    this.router.navigate(['/login']);
    this.isAuth = false;
    return false;
  }

  isAuthenticated() {
    return this.token ? true : false;
  }

  mapResponse(response) {
    const token = response.json() && response.json().token;
    const user = response.json() && response.json().user;
    return this.checkForToken(token, user);
  }

  checkForToken(token, user) {
    if (token) this.token = token;
    this.setLocalStorage(token, user);
    this.isAuth = true;
    return user;
  }

  setLocalStorage(token, user) {
    if (token) localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  resetTokens() {
    this.token = null;
    this.user = null;
    this.isAuth = false;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['']);
  }
}
