export class Itinerary {
  _id: string;
  name: string;
  nationality1: string;
  nationality2: string;
  placesAndDates: any[];

  constructor() {
    (this._id = ''),
      (this.name = ''),
      (this.nationality1 = ''),
      (this.nationality2 = ''),
      (this.placesAndDates = []);
  }
}

export class NewItinerary {
  name: string;
  nationality1: string;
  nationality2: string;
  placesAndDates: any[];
}

export class Destination {
  geoLocation: any;
  date: string;
  days: number;
  transport: string;
  country: string;
  currency: string;
  details: any;
  price: number;

  constructor() {
    (this.geoLocation = ''),
      (this.date = ''),
      (this.transport = 'plane'),
      (this.country = ''),
      (this.currency = '$'),
      (this.details = ''),
      (this.price = null),
      (this.days = 0)
  }
}

export interface Expense {
  note: string;
  expense: number;
  transport: string;
}

export interface Export {
  name: string;
  date: any;
  days: any;
  details: {
    note: any;
    expense: number;
    transport: string;
  };
  transport: string;
  country: any;
  price: any;
  point: {
    lat: any;
    lng: any;
  };
}
