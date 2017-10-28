import { Export, Destination } from 'app/shared/models/itinerary.model';
import { combineTransportOptions } from 'app/utils';

declare const google: any;

export class FlightPathBuilder {
  static buildFlightPath(itineraryDestination: Destination, saved?: boolean): Export {
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
      return;
    }
  }

  static setCoordinates(itineraryDestination: Destination, coordinate: string, saved?): number | any {
    return saved ? itineraryDestination[coordinate] : itineraryDestination[coordinate]()
  }
}
