export class User {
    _id: string;
    itineraries: UserItinerary[];
    places_visited: any[];
    name: string;
    username: string;
    nationalities: string[]
    password: string;

    constructor() {
        this._id = '',
        this.itineraries = [],
        this.places_visited = [],
        this.name = '',
        this.username = '',
        this.nationalities = []
        this.password = ''
    }
}

export interface UserItinerary {
  flightPaths: any[],
  name: string,
  nationalities: string[],
  placesAndDates: any[],
  userId: string[],
}