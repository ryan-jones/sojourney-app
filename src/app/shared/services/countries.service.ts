import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map'; //allows angular to recognize the map operator
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CountryService {
  // BASE_URL: string = 'https://sojourney.herokuapp.com';
  BASE_URL: string = 'http://localhost:3000';

  constructor(private http: Http) {}
  countries$: Observable<Response> = this.http
    .get(`${this.BASE_URL}/api/countries`)
    .map(res => res.json());
}
