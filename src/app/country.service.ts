import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';  //allows angular to recognize the map operator


@Injectable()

export class CountryService {
  BASE_URL: string = 'http://localhost:3000';
  constructor(private http: Http) {}

  getList() {
    return this.http.get(`${this.BASE_URL}/api/countries`)
      .map((res) => res.json());
  }

  get(id) {
  return this.http.get(`${this.BASE_URL}/api/countries/${id}`)
    .map((res) => res.json());
  }
}
