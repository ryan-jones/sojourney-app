import { Injectable } from '@angular/core';

export interface Expense {
  note: string;
  expense: number;
  transport: string;
}

export interface Export {
  address: any;
  name: string;
  date: any;
  days: any;
  transport: string;
  country: any;
  price: any;
  point: {
    lat: any;
    lng: any;
  };
}

@Injectable()
export class ItineraryService {
  buildExportValue(address, itineraryDestination): Export {
    return {
      address: address,
      name: itineraryDestination.name,
      date: itineraryDestination.date,
      days: itineraryDestination.date,
      transport: itineraryDestination.transport,
      country: itineraryDestination.country,
      price: itineraryDestination.price,
      point: {
        lat: itineraryDestination.geometry.location.lat(),
        lng: itineraryDestination.geometry.location.lng()
      }
    };
  }

  calculateDateRange(dates) {
    return Math.round(
      Math.abs(
        new Date(dates[dates.length - 1]).getTime() -
          new Date(dates[dates.length - 2]).getTime()
      ) /
        (1000 * 3600 * 24)
    );
  }
}
