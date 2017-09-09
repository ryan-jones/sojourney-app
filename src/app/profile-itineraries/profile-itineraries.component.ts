import {
  Component,
  OnInit,
  ViewChild,
  ViewChildren,
  QueryList
} from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../session.service';
import { UserService } from '../user.service';
import { CountryService } from '../country.service';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TabsetComponent } from 'ngx-bootstrap';

declare var google: any;

@Component({
  selector: 'app-profile-itineraries',
  templateUrl: './profile-itineraries.component.html',
  styleUrls: ['./profile-itineraries.component.css']
})
export class ProfileItinerariesComponent implements OnInit {
  @ViewChild('staticTabs') staticTabs: TabsetComponent;

  user: any;
  map: any;

  constructor(
    private router: Router,
    private session: SessionService,
    private userService: UserService,
    private country: CountryService
  ) {}
  selectedNationalityId1;
  selectedNationalityId2;
  countries;
  countries2;
  nation;
  nation2;
  countryName1;
  countryName2;
  address;
  newAddress: any;
  geocoder;
  flightPath;

  place: any;
  diffDays: number;
  totalItinerary;
  sum: any;
  deleteLocation;
  marker;
  indexTarget;
  locationIndex;
  locations: Array<any> = [];
  itineraryDays: Array<any> = [];
  loopTravelArray: Array<any> = [];
  loopDatesArray: Array<any> = [];
  dates = [];
  arrayOfTravel = [];
  allTravelArray: Array<any> = [];
  allMarkers: Array<any> = [];
  allFlightPaths: Array<any> = [];
  allItinerariesArray: Array<any> = [];
  colorLayers: Array<any> = [];
  layers: Array<any> = [];
  coordinates: Array<any> = [];
  indexProvider: Array<any> = [];

  ngOnInit() {
    let user = JSON.parse(localStorage.getItem('user'));
    if (user === null) {
      this.user = '';
    } else {
      this.userService.getTest(user._id).subscribe(user => {
        this.user = user;

        let arr = [];
        this.user.arr.forEach((item, index) => {
          this.selectedNationalityId1 = !item.nationality1 ? '' : item.nationality1
          this.selectedNationalityId2 = !item.nationality3 ? '' : item.nationality2

          this.locations.push(item.placesAndDates);

          this.coordinates = [];
          const date = [];

          item.placesAndDates.forEach(place => {
            this.coordinates.push(place.geometry.location);
            date.push(place.date);
          });

          this.arrayOfTravel.push(this.coordinates);
          this.dates.push(date);

          arr.push(item);

          this.initiateMap();
          // this.loadCountries(this.selectedNationalityId1, this.selectedNationalityId2)
          // this.loadPolylines(this.coordinates);
          // this.differenceInDays();
        });
        this.allItinerariesArray = arr;
      });
    }

    this.country.getList().subscribe(countries => {
      this.countries = countries;
      this.countries2 = countries;
    });

    

    this.countryName1 = !this.countryName1 ? '' : this.countryName1;
    this.countryName2 = !this.countryName2 ? '' : this.countryName2;

    this.sum = 0;
  } 

  initiateMap() {
    var myOptions = {
      zoom: 2,
      center: new google.maps.LatLng(10, 0),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    // initialize the map

    this.map = new google.maps.Map(
      document.getElementsByClassName('map-canvas'),
      myOptions
    );
    var styles = [
      {
        featureType: 'landscape',
        stylers: [{ hue: '#fff' }, { saturation: 100 }]
      },
      {
        featureType: 'road',
        stylers: [{ visibility: 'on' }]
      },
      {
        featureType: 'administrative.land_parcel',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'administrative.locality',
        stylers: [{ visibility: 'on' }]
      },
      {
        featureType: 'administrative.neighborhood',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'administrative.province',
        stylers: [{ visibility: 'on' }]
      },
      {
        featureType: 'landscape.man_made',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'landscape.natural',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'poi',
        stylers: [{ visibility: 'on' }]
      },
      {
        featureType: 'transit',
        stylers: [{ visibility: 'off' }]
      }
    ];

    this.map.setOptions({ styles: styles });
  }

  //************* load itineraries on the map **************
  loadCountries(selectedNationalityId1, selectedNationalityId2) {
    const countriesArray = [selectedNationalityId1, selectedNationalityId2];

    const colorsArray = {
      visaFree: ['red', 'blue'],
      visaOnArrival: ['yellow', 'green']
    };

    let index = 0;
    this.showCountries(countriesArray, colorsArray, index);
  }

  //********************   creates country data layers ***************
  showCountries(countriesArray, colorsArray, index) {
    if (index === 2) {
      return;
    }

    this.country.get(countriesArray[index]).subscribe(nation => {
      this.nation = nation;

      this.countryName1 = this.nation;

      var self = this;

      let visaKindArray = ['visaFree', 'visaOnArrival'];
      let visaKindIndex = 0;

      let counter = 0;

      var test = 0;

      function starter(visaKind) {
        let freeLayer = new google.maps.Data();

        freeLayer.loadGeoJson(
          'https://raw.githubusercontent.com/johan/world.geo.json/master/countries/' +
            self.nation[visaKind][counter] +
            '.geo.json'
        );
        freeLayer.setStyle({
          fillColor: colorsArray[visaKind][index],
          fillOpacity: 0.5,
          title: self.nation[visaKind][counter]
        });

        freeLayer.setMap(self.map);
        counter++;

        self.layers.push(freeLayer);

        if (counter == self.nation[visaKind].length) {
          counter = 0;
          if (visaKind == 'visaOnArrival') {
            index++;
            self.showCountries(countriesArray, colorsArray, index);
          } else {
            visaKindIndex++;

            starter(visaKindArray[visaKindIndex]);
          }
        } else {
          starter(visaKindArray[visaKindIndex]);
        }
      }

      starter(visaKindArray[visaKindIndex]);
    });
  } //showCountries

  loadPolylines(any) {
    //geocodes the address, creates a marker and polyline segment
    this.geocoder = new google.maps.Geocoder();
    var that = this;
    this.address = this.newAddress;

    this.geocoder.geocode({ address: this.address }, function(results, status) {
      if (status === 'OK') {
        that.flightPath = new google.maps.Polyline({
          path: any,
          geodesic: true,
          strokeColor: 'yellow',
          strokeOpacity: 1.0,
          strokeWeight: 4
        });

        that.flightPath.setMap(that.map);

        that.coordinates.forEach(coordinates => {
          that.marker = new google.maps.Marker({
            position: coordinates,
            map: that.map
          });
          that.marker.setIcon(
            'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
          );
        });
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

  //turns dates into numerical values for comparison
  // differenceInDays(){
  //   this.diffDays = (Math.abs(new Date(this.dates[this.dates.length-1]).getTime() - new Date(this.dates[this.dates.length - 2]).getTime())) / (1000 * 3600 * 24);
  //   if(isNaN(this.diffDays)===true){
  //     this.diffDays = 0;
  //   }
  //
  //
  // //array of differences between dates to be loaded on the view
  //   this.itineraryDays.push(this.diffDays);
  // }

  selectTab(tab_id: number) {
    this.staticTabs.tabs[tab_id].active = true;
  }
}
