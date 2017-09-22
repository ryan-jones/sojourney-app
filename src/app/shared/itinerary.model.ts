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
