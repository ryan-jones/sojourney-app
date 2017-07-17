import { Injectable } from '@angular/core';
import { Http, Headers,Response, RequestOptions} from '@angular/http';
import { SessionService } from './session.service'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()

export class UserService {
  // BASE_URL: string = 'https://sojourney.herokuapp.com/api';
  BASE_URL: string = 'http://localhost:3000/api';

  constructor(
    private http: Http,
    private SessionService: SessionService
  ) {

  }

  getList() {

    let headers = new Headers({ 'Authorization': 'JWT ' + this.SessionService.token });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(`${this.BASE_URL}/users`, options)
      .map((res) => res.json());
  }

  get(id) {
    let headers = new Headers({ 'Authorization': 'JWT ' + this.SessionService.token });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(`${this.BASE_URL}/users/${id}`, options)
      .map((res) => res.json());
  }

  getTest(id) {
    let headers = new Headers({ 'Authorization': 'JWT ' + this.SessionService.token });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(`${this.BASE_URL}/users/${id}`, options)
      .map((res) => res.json())
      .map((data) => {
        let arr = [];
        data.itineraries.forEach((item, index)=>{
          console.log('item: ', item.flightPaths)
          arr.push(item);
        })
        console.log('user service ', arr)
        return {
          arr: arr
        };
      });
  }


  edit(id) {
    let headers = new Headers({ 'Authorization': 'JWT ' + this.SessionService.token });
    let options = new RequestOptions({ headers: headers });
<<<<<<< HEAD
    console.log("before put");
    console.log('id', id);
    return this.http.put(`${this.BASE_URL}/users`, id, options )
=======
    return this.http.post(`${this.BASE_URL}/users/${user.id}`, user, options)
>>>>>>> master
      .map((res) => res.json());
  }

  editItinerary(it) {
    let headers = new Headers({ 'Authorization': 'JWT ' + this.SessionService.token });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(`${this.BASE_URL}/itinerary`, it)
      .map((res) => res.json());
  }

  remove(id) {
    let headers = new Headers({ 'Authorization': 'JWT ' + this.SessionService.token });
    let options = new RequestOptions({ headers: headers });
    return this.http.delete(`${this.BASE_URL}/users/${id}`, options)
      .map((res) => res.json());
  }
}
