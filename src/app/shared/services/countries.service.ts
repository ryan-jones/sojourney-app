import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map'; 
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CountryService {
  // BASE_URL: string = 'https://sojourney.herokuapp.com';
  BASE_URL: string = 'http://localhost:3000';

  constructor(private http: Http) {}

  countries$: Observable<Response> = this.http
    .get(`${this.BASE_URL}/api/countries`)
    .map(res => res.json());


  identifyCountryId(userItineraries, countries): string[] {
    const nationalities = userItineraries[0].nationalities.length
      ? userItineraries[0].nationalities
      : ['Taiwan'];

    return nationalities.map(nationality => {
      const country = countries.find(country => country.name === nationality);
      return country._id;
    });
  }
}
