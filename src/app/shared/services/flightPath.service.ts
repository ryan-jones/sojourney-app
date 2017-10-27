import { Injectable } from '@angular/core';
import { Coordinate } from 'app/shared/map.model';
import { Export, Destination } from 'app/shared/itinerary.model';
import {
  initialInfoWindow,
  supplementaryInfoWindow,
  removeLocation
} from 'app/utils';

declare const google;

@Injectable()
export class FlightPathService {
  private marker: any;
  private map: any;
  private geocoder = new google.maps.Geocoder();
  private infowindow = new google.maps.InfoWindow();
  private destinationCoordinates: Coordinate[] = [];
  private flightPathData: any;
  private itineraryPath: any[] = [];
  private mapMarkers: any[] = [];
  private locations: any[] = [];

  setGeocodeMarkers(data: Export, map: any) {
    if (data.point && data.date) {
      this.map = map;
      this.buildflightPath(this.geocoder, data);
    }
  }

  buildflightPath(geocoder: any, data) {
    console.log('buildFlightPath', data)
    const that = this;
    const name = data.name;
    const date = data.date;
    const days = data.days;
    const transport = data.transport;
    const country = data.country;
    const price = data.price;
    const point = data.point;
    geocoder.geocode({ address: data.name }, function(results, status) {
      if (status === 'OK') {
        that.createflightPath(point);
        that.setMarker(
          point,
          name,
          country,
          date,
          days,
          transport,
          price,
          that.infowindow
        );
      }
    });
  }

  createflightPath(point: Coordinate) {
    this.destinationCoordinates.push(point);
    this.flightPathData = this.setPolyline(this.destinationCoordinates);
    this.itineraryPath.push(this.flightPathData);
    this.flightPathData.setMap(this.map);
  }

  setMarker(
    point: any,
    name: string,
    country: string,
    date: string,
    days: number,
    transport: string,
    price: number,
    infowindow: any
  ) {
    this.marker = this.setNewMarker(
      point,
      this.map,
      name,
      country,
      date,
      days,
      transport,
      price
    );
    console.log('marker', this.marker)
    this.marker.setIcon(
      'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
    );
    this.mapMarkers.push(this.marker);
    this.setWindowContent(
      name,
      country,
      infowindow,
      date,
      days,
      transport,
      price
    );
  }

  setWindowContent(
    name: string,
    country: string,
    infowindow: any,
    date: string,
    days: number,
    transport: string,
    price: number
  ) {
    this.locations.length === 1
      ? initialInfoWindow(this.marker, name, country, infowindow, this.map)
      : supplementaryInfoWindow(
          this.marker,
          name,
          country,
          infowindow,
          this.map,
          days,
          date,
          transport,
          price
        );
  }

  newPolyline(destinationCoordinates: Coordinate[]): any {
    return new google.maps.Polyline({
      path: destinationCoordinates,
      geodesic: true,
      strokeColor: 'yellow',
      strokeOpacity: 1.0,
      strokeWeight: 4
    });
  }

  newMarker(point: Coordinate, map: any): any {
    return new google.maps.Marker({
      map,
      position: point
    });
  }

  setPolyline(destinationCoordinates: Coordinate[]): any {
    return new google.maps.Polyline({
      path: destinationCoordinates,
      geodesic: true,
      strokeColor: 'yellow',
      strokeOpacity: 1.0,
      strokeWeight: 4
    });
  }

  resetMapValues(input) {
    this.clearPolylines();
    this.clearMarkers(this.mapMarkers);
    this.deleteLocation(input);
    this.resetPolylines();
  }

  clearMapValues(){
    this.clearPolylines();
    this.clearMarkers(this.mapMarkers);
    this.clearLocations();
    this.resetPolylines();
  }

  clearPolylines() {
    this.itineraryPath.forEach(flightPathData => {
      flightPathData.setMap(null);
    });
    this.itineraryPath = [];
  }

  clearLocations(){
    this.locations = [];
  }

  resetPolylines() {
    this.destinationCoordinates = [];
    this.locations.forEach(location => {
      const point = {
        lat: location.geoLocation.geometry.location.lat(),
        lng: location.geoLocation.geometry.location.lng()
      };
      this.destinationCoordinates.push(point);
      this.resetFlightPath();
      this.buildMarkers(point);
    });
  }

  resetFlightPath() {
    this.flightPathData = this.newPolyline(this.destinationCoordinates);
    this.flightPathData.setMap(this.map);
    this.itineraryPath.push(this.flightPathData);
  }

  buildMarkers(point: Coordinate) {
    this.marker = this.newMarker(point, this.map);
    this.marker.setIcon(
      'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
    );
    this.mapMarkers.push(this.marker);
  }

  deleteLocation(locationInput: Destination) {
    this.locations = removeLocation(this.locations, locationInput);
  }

  setNewMarker(
    position,
    map,
    name,
    country,
    date,
    days,
    transport,
    price
  ): any {
    console.log('position', position)
    return new google.maps.Marker({
      position,
      map,
      name,
      country,
      date,
      days,
      transport,
      price
    });
  }

  clearMarkers(mapMarkers: any) {
    mapMarkers.forEach(marker => {
      marker.setMap(null);
    });
    this.mapMarkers = [];
  }
}
