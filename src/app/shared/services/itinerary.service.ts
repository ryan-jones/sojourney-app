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
  createCountryName(itineraryDestination): string {
    const countryStringSplit = itineraryDestination.geoLocation.formatted_address.split(
      ','
    );
    return countryStringSplit[countryStringSplit.length - 1];
  }

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
        lat: itineraryDestination.geoLocation.geometry.location.lat(),
        lng: itineraryDestination.geoLocation.geometry.location.lng()
      }
    };
  }

  calculateDateRange(dates: string[]): number {
    const range = Math.round(
      Math.abs(
        new Date(dates[dates.length - 1]).getTime() -
          new Date(dates[dates.length - 2]).getTime()
      ) /
        (1000 * 3600 * 24)
    );
    return !range ? 0 : range;
  }

  updateDateRange(dates: string[], dayIndex: number): number {
    const range =
      Math.abs(
        new Date(dates[dayIndex]).getTime() -
          new Date(dates[dayIndex - 1]).getTime()
      ) /
      (1000 * 3600 * 24);
    return !range ? 0 : range;
  }

  aggregate(input: number[]): number {
    return input.reduce((a, b) => a + b, 0);
  }
}
