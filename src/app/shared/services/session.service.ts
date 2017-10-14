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

  signup(user) {
    return this.http
      .post(`${this.BASE_URL}/signup`, user._value)
      .map((response: Response) => {
        return this.mapResponse(response);
      });
  }

  login(user) {
    return this.http
      .post(`${this.BASE_URL}/login`, user)
      .map((response: Response) => {
        return this.mapResponse(response);
      });
  }

  mapResponse(response) {
    const token = response.json() && response.json().token;
    const user = response.json() && response.json().user;
    return this.checkForToken(token, user);
  }

  checkForToken(token, user) {
    if (token) {
      this.token = token;
      this.isAuth = true;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return user;
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
