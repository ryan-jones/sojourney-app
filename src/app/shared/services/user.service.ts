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

  getUser(id) {
    return this.http
      .get(`${this.BASE_URL}/api/users/${id}`, this.options)
      .map((res: Response) => res.json());
  }

  signup(user) {
    return this.http
      .post(`${this.BASE_URL}/signup`, user._value)
      .map((res: Response) => {
        return this.sessionService.mapResponse(res);
      });
  }

  login(user) {
    return this.http
      .post(`${this.BASE_URL}/login`, user._value)
      .map((res: Response) => {
        return this.sessionService.mapResponse(res);
      });
  }

  logout() {
    this.sessionService.resetTokens();
  }

  editUser(id) {
    return this.http
      .put(`${this.BASE_URL}/api/users`, id, this.options)
      .map((res: Response) => this.sessionService.mapResponse(res));
  }

  editItinerary(id) {
    return this.http
      .post(`${this.BASE_URL}/api/itinerary`, id, this.options)
      .map((res: Response) => res.json());
  }

  deleteUser(id) {
    return this.http
      .delete(`${this.BASE_URL}/api/users/${id}`, this.options)
      .map((res: Response) => res.json());
  }
}
