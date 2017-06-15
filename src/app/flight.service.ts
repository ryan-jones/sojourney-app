import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions} from '@angular/http';
import { SessionService } from './session.service'
import 'rxjs/add/operator/map';


@Injectable()
export class FlightService {
  BASE_URL: string = `https://api.skypicker.com/flights?v=2&locale=en&flyFrom=`;

  constructor( private http: Http) {}

  getLocation(location){
    return this.http.get(`https://api.skypicker.com/places?term=${location}&v=2&locale=en`)
      .map((res) => res.json());
  }


  getFlights(flight){
    let departureDays = [];
    let returnDays = [];
    let request = `${this.BASE_URL}${flight.from}&to=${flight.to}&dateFrom=`;

    flight.departures.forEach((departure)=>{
      let departureDate = encodeURIComponent(departure);
      departureDays.push(departureDate);
    })

    flight.returns.forEach((flight)=>{
      let returnDate = encodeURIComponent(flight);
      returnDays.push(returnDate);
    })

    if (flight.type === "return"){
      if(departureDays.length === 2 && returnDays.length < 2){
        request = `${request}${departureDays[0]}&dateTo=${departureDays[1]}&typeFlight=return&returnFrom=${returnDays[0]}`;
      } else if(departureDays.length === 2 && returnDays.length === 2){
        request = `${request}${departureDays[0]}&dateTo=${departureDays[1]}&typeFlight=return&returnFrom=${returnDays[0]}&returnTo=${returnDays[1]}`;
      } else if (departureDays.length < 2 && returnDays.length < 2){
        request = `${request}${departureDays[0]}&typeFlight=return&returnFrom=${returnDays[0]}`;
      } else {
        request = `${request}${departureDays[0]}&typeFlight=return&returnFrom=${returnDays[0]}&returnTo=${returnDays[1]}`
      }
    }
     return this.http.get(request)
      .map((res) => res.json());
  }
}
