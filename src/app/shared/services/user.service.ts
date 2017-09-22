import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { SessionService } from './session.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class UserService {
  BASE_URL: string = 'https://sojourney.herokuapp.com/api';
  // BASE_URL: string = 'http://localhost:3000/api';

  constructor(private http: Http, private SessionService: SessionService) {}

  headers = new Headers({
    Authorization: 'JWT ' + this.SessionService.token
  });

  options = new RequestOptions({ headers: this.headers });

  getList() {
    return this.http
      .get(`${this.BASE_URL}/users`, this.options)
      .map(res => res.json());
  }

  getUser(id) {
    return this.http
      .get(`${this.BASE_URL}/users/${id}`, this.options)
      .map(res => res.json());
  }

  getTest(id) {
    return this.http
      .get(`${this.BASE_URL}/users/${id}`, this.options)
      .map(res => res.json())
      .map(data => {
        const arr = [];
        data.itineraries.forEach((item, index) => {
          arr.push(item);
        });
        return {
          arr: arr
        };
      });
  }

  editUser(id) {
    return this.http
      .put(`${this.BASE_URL}/users`, id, this.options)
      .map(res => res.json());
  }

  editItinerary(id) {
    return this.http
      .post(`${this.BASE_URL}/itinerary`, id, this.options)
      .map(res => res.json());
  }

  deleteUser(id) {
    return this.http
      .delete(`${this.BASE_URL}/users/${id}`, this.options)
      .map(res => res.json());
  }
}
