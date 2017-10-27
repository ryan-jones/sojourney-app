import { Export } from 'app/shared/itinerary.model';
import { combineTransportOptions } from 'app/utils';

declare const google: any;

export class FlightPathBuilder {
  static buildFlightPath(itineraryDestination, saved?: boolean): Export | any {
    if (itineraryDestination.geoLocation && itineraryDestination.date) {
      return {
        details: itineraryDestination.details,
        name: itineraryDestination.geoLocation.name,
        date: itineraryDestination.date,
        days: itineraryDestination.days,
        transport: itineraryDestination.details
          ? combineTransportOptions(itineraryDestination.details)
          : itineraryDestination.transport,
        country: itineraryDestination.country,
        price: itineraryDestination.price,
        point: {
          lat: this.setCoordinates(itineraryDestination.geoLocation.geometry.location, 'lat', saved), 
          lng: this.setCoordinates(itineraryDestination.geoLocation.geometry.location, 'lng', saved) 
        }
      };
    }
    else {
      return itineraryDestination;
    }
  }

  static setCoordinates(itineraryDestination, coordinate: string, saved?, ){
    return saved ? itineraryDestination[coordinate] : itineraryDestination[coordinate]()
  }
}
