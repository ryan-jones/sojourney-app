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
  name: string;
  date: string;
  transport: string;
  country: string;
  currency: string;
  details: any;
  price: number;

  constructor() {
    this.geoLocation = '',
    this.name = '',
    this.date = '',
    this.transport = 'plane',
    this.country = '',
    this.currency = '$',
    this.details = '',
    this.price = null
  }
}
