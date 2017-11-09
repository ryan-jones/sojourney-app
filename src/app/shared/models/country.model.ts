export class Country {
  _id: string;
  bannedFrom: string[];
  countryCode: string;
  name: string;
  visaFree: string[];
  visaOnArrival: string[];

  constructor() {
    (this._id = ''),
      (this.bannedFrom = []),
      (this.countryCode = ''),
      (this.name = ''),
      (this.visaFree = []),
      (this.visaOnArrival = []);
  }
}

export interface SelectedCountry {
  nationalities: string[];
  visaFree?: string[];
  voa?: string[];
}
