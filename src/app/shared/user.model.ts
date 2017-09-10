export class User {
    _id: string;
    itineraries: any[];
    places_visited: any[];
    name: string;
    username: string;
    nationality: string;
    nationality2: string;
    password: string;

    constructor() {
        this._id = '',
        this.itineraries = [],
        this.places_visited = [],
        this.name = '',
        this.username = '',
        this.nationality = '',
        this.nationality2 = '',
        this.password = ''
    }
}