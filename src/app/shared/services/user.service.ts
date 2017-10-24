import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { SessionService } from './session.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class UserService {
  // BASE_URL: string = 'https://sojourney.herokuapp.com/api';
  BASE_URL: string = 'http://localhost:3000';

  constructor(private http: Http, private sessionService: SessionService) {}

  headers = new Headers({
    Authorization: 'JWT ' + this.sessionService.token
  });

  options = new RequestOptions({ headers: this.headers });

  getTest(id) {
    return this.http
      .get(`${this.BASE_URL}/api/users/${id}`, this.options)
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

  signup(user) {
    return this.http
      .post(`${this.BASE_URL}/signup`, user._value)
      .map((response: Response) => {
        return this.sessionService.mapResponse(response);
      });
  }

  login(user) {
    return this.http
      .post(`${this.BASE_URL}/login`, user)
      .map((response: Response) => {
        return this.sessionService.mapResponse(response);
      });
  }

  logout() {
    this.sessionService.resetTokens();
  }

  editUser(id) {
    return this.http
      .put(`${this.BASE_URL}/api/users`, id, this.options)
      .map((response: Response) => 
        this.sessionService.mapResponse(response)
      );
  }

  editItinerary(id) {
    return this.http
      .post(`${this.BASE_URL}/api/itinerary`, id, this.options)
      .map(res => res.json());
  }

  deleteUser(id) {
    return this.http
      .delete(`${this.BASE_URL}/api/users/${id}`, this.options)
      .map(res => res.json());
  }
}
