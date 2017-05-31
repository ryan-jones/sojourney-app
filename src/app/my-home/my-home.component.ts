import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {CountryService} from '../country.service';
import {WarningService} from '../warning.service';
import {SessionService} from '../session.service';
import {UserService} from '../user.service';
import { FileUploader } from "ng2-file-upload";

declare var google: any;

@Component({
  selector: 'app-my-home',
  templateUrl: './my-home.component.html',
  styleUrls: ['./my-home.component.css'],
  providers: [CountryService, WarningService, SessionService, UserService]
})

export class MyHomeComponent implements OnInit {

  uploader: FileUploader = new FileUploader({
    url: `http://localhost:3000/api/users/`,
    authToken: `JWT ${this.session.token}`
  });

  newItinerary = {
    name: '',
    nationality1: '',
    nationality2: '',
    plan: []
  };

  feedback:string;

  selectedNationalityId1;
  selectedNationalityId2;
  map: any;
  countries;
  countries2;
  warnings;
  nation;
  nation2;
  countryName1;
  countryName2;
  address;
  newAddress: any;
  geocoder;
  flightPath;
  arrayOfTravel = [];
  place: any;
  locations: Array<any> = [];
  dates = [];
  diffDays: number;
  itineraryDays: Array<any>=[];
  totalItinerary;
  sum: any;
  deleteLocation;
  marker;
  indexTarget;
  locationIndex;
  allMarkers: Array<any> = [];
  allFlightPaths: Array<any> = [];
  allTravelArray: Array<any> = [];
  colorLayers: Array<any> = [];
  layers: Array<any> = [];

  freeLayer;
  freeLayer2;



  constructor(private country: CountryService, private status: WarningService, private session: SessionService, private userService: UserService) { }



  ngOnInit() {


    this.initiateMap();

    this.uploader.onSuccessItem = (item, response) => {
      this.feedback = JSON.parse(response).message;
    };

    this.uploader.onErrorItem = (item, response, status, headers) => {
      this.feedback = JSON.parse(response).message;
    };


    this.country.getList()
      .subscribe((countries) => {
        this.countries = countries;
      });
    this.country.getList()
      .subscribe((countries2) =>{
        this.countries2 = countries2;
      })

      if(this.countryName1 === undefined){
        this.countryName1 = '';
      }
      if(this.countryName2 === undefined){
        this.countryName2 = '';
      }

      // this.status.getList()
      //   .subscribe((warnings)=>{
      //     this.warnings = warnings;
      //   })
      //   console.log(this.warnings);

        this.sum = 0;
  }


//**************** creates initial map *********
  initiateMap(){

    var myOptions = {
      zoom: 2,
      center: new google.maps.LatLng(10, 0),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    // initialize the map
    this.map = new google.maps.Map(document.getElementById('map-canvas'),
        myOptions);

        var styles = [

        {
          featureType: "landscape",
          stylers: [
            { hue: "#fff" },
            { saturation: 100 }
          ]
        },{
          featureType: "road",
          stylers: [
            { visibility: "on" }
          ]
        },{
          featureType: "administrative.land_parcel",
          stylers: [
            { visibility: "off" }
          ]
        },{
          featureType: "administrative.locality",
          stylers: [
            { visibility: "on" }
          ]
        },{
          featureType: "administrative.neighborhood",
          stylers: [
            { visibility: "off" }
          ]
        },{
          featureType: "administrative.province",
          stylers: [
            { visibility: "on" }
          ]
        },{
          featureType: "landscape.man_made",
          stylers: [
            { visibility: "off" }
          ]
        },{
          featureType: "landscape.natural",
          stylers: [
            { visibility: "off" }
          ]
        },{
          featureType: "poi",
          stylers: [
            { visibility: "on" }
          ]
        },{
          featureType: "transit",
          stylers: [
            { visibility: "off" }
          ]
        }
      ];

    this.map.setOptions({styles: styles});

     let input = document.getElementById('new-address');
     let autocomplete = new google.maps.places.Autocomplete(input);

     autocomplete.addListener("place_changed", ()=> {
     this.place = autocomplete.getPlace()

     })

  }

//**************** total days*********************
totalDays(){
  var total = this.itineraryDays.reduce((a, b) => a + b, 0);
  // this.sum = this.itineraryDays.reduce((a, b) => a + b, 0);

  if(total === 0 || total === NaN || total === undefined){
    this.sum === 0;
    return this.sum;
  } else{
    this.sum = total;
    return this.sum;
  }

}



//********************** shows country layers *************
 loadCountries(selectedNationalityId1, selectedNationalityId2){
  let countriesArray = [selectedNationalityId1, selectedNationalityId2]

  let colorsArray = {
    visaFree: ['red', 'blue'],
    visaOnArrival: ['yellow', 'green']
  }

  let index = 0
  this.showCountries(countriesArray, colorsArray, index);
}

//********************   creates country data layers ***************
  showCountries(countriesArray, colorsArray, index ){

    if(index == 2){
      return
    }

    this.country.get(countriesArray[index])
        .subscribe((nation) => {
          this.nation = nation;
          console.log("nation", nation)

          this.countryName1 = this.nation;

          var self = this

          let visaKindArray = ['visaFree', 'visaOnArrival' ];
          let visaKindIndex = 0;


          let counter = 0;

          var test = 0;

          function starter(visaKind){

          let freeLayer = new google.maps.Data();

          if(index === 0){


                console.log( "country", self.nation[visaKind][counter])
            freeLayer.loadGeoJson('https://raw.githubusercontent.com/johan/world.geo.json/master/countries/' + self.nation[visaKind][counter] + '.geo.json');
              freeLayer.setStyle({ fillColor: colorsArray[visaKind][index], fillOpacity: 0.5, title: self.nation[visaKind][counter]});

              freeLayer.setMap(self.map);
              counter++

              self.layers.push(freeLayer)
            } else {

                counter++
             self.layers.forEach(function(layer){
               if(layer.style.title == self.nation[visaKind][counter]) {
                  // console.log("layer", layer)

                 // console.log(self.nation[visaKind][counter])
                  //  layer.setMap(null);
                   layer.setStyle({ fillColor: "black", fillOpacity: 1});
                  //    layer.setMap(self.map);
                  //  layer.setMap(self.map);
                }else {
                  freeLayer.loadGeoJson('https://raw.githubusercontent.com/johan/world.geo.json/master/countries/' + self.nation[visaKind][counter] + '.geo.json');

                    freeLayer.setStyle({ fillColor: colorsArray[visaKind][index], fillOpacity: 1, title: self.nation[visaKind][counter]});
                    freeLayer.setMap(self.map);
                }})
              }


              if(counter == self.nation[visaKind].length){
                counter = 0
                if(visaKind == 'visaOnArrival'){
                  index ++
                  self.showCountries(countriesArray, colorsArray, index);
                } else {
                  visaKindIndex++

                  starter(visaKindArray[visaKindIndex])
                  }
                } else {

                  starter(visaKindArray[visaKindIndex])
                }
                }

                starter(visaKindArray[visaKindIndex])
              })
      } //showCountries

makeBlack(){
  console.log("maop",this.map)
  console.log("data", this.map.data)
  this.map.data.forEach((data)=>{
    console.log("data", data)
  })
  setTimeout(()=>{

    this.layers.forEach((layer)=>{

     //  if(layer.style.title == self.nation[visaKind][counter]) {

        // console.log(self.nation[visaKind][counter])
          // layer.setMap(null);
          this.map.data.setStyle({visible: false});
          // layer.setMap(this.map);
     //  }
    })
  },10000)

}
  //*************** Creates a point/polyline on the map **********
    createPoint(){

      //date input field
      this.place.date = document.getElementById('new-date')['valueAsDate'];
      this.place.date.autocomplete;
      this.locations.push(this.place);
      this.dates.push(this.place.date);

  //turns dates into numerical values for comparison
      if(this.dates.length >=0){
        this.diffDays = (Math.abs(new Date(this.dates[this.dates.length-1]).getTime() - new Date(this.dates[this.dates.length - 2]).getTime())) / (1000 * 3600 * 24);
        if(isNaN(this.diffDays)===true){
          this.diffDays = 0;
        }
      }

      //array of differences between dates to be loaded on the view
      this.itineraryDays.push(this.diffDays);
      this.totalDays();

  //geocodes the address, creates a marker and polyline segment
      this.geocoder = new google.maps.Geocoder();
      var that = this;
  	  this.address = this.newAddress;

  	  this.geocoder.geocode({'address': this.address}, function(results, status) {

  	     if (status === 'OK') {
           var point = {lat: that.place.geometry.location.lat(), lng: that.place.geometry.location.lng()}


  	       that.arrayOfTravel.push(point);
           that.allTravelArray.push(that.arrayOfTravel);

           that.flightPath = new google.maps.Polyline({
               path: that.arrayOfTravel,
               geodesic: true,
               strokeColor: 'yellow',
               strokeOpacity: 1.0,
               strokeWeight: 4,

             });
             that.allFlightPaths.push(that.flightPath)
           that.flightPath.setMap(that.map);
           that.marker = new google.maps.Marker({
             position: point,
             map: that.map
           })


           that.marker.setIcon('http://maps.google.com/mapfiles/ms/icons/yellow-dot.png')
           that.allMarkers.push(that.marker)

  	     } else {
  	        alert('Geocode was not successful for the following reason: ' + status);
  	     }
  	  });

    }


  deletePoint(locationInput){

    this.allFlightPaths.forEach((flightPath)=>{
      flightPath.setMap(null)
    })
   this.allFlightPaths = []

    this.allMarkers.forEach((marker)=>{
       marker.setMap(null);

    })
    this.allMarkers = []


    this.locations = this.locations.filter((savedLocation)=>{
      return savedLocation.id != locationInput.value
    })

     this.arrayOfTravel = []


    this.locations.forEach((location)=>{



      var point = {lat: location.geometry.location.lat(), lng: location.geometry.location.lng()}


      this.arrayOfTravel.push(point);

       this.flightPath = new google.maps.Polyline({
           path: this.arrayOfTravel,
           geodesic: true,
           strokeColor: 'yellow',
           strokeOpacity: 1.0,
           strokeWeight: 4,

         });
       this.flightPath.setMap(this.map);


       this.allFlightPaths.push(this.flightPath)
       this.marker = new google.maps.Marker({
         position: point,
         map: this.map
       })
       this.marker.setIcon('http://maps.google.com/mapfiles/ms/icons/yellow-dot.png')
        this.allMarkers.push(this.marker)
    })

  }


  // submit() {
  //
  //   this.newItinerary.plan = this.arrayOfTravel;
  //
  //   this.uploader.onBuildItemForm = (item, form) => {
  //     form.append('name', this.newItinerary.name);
  //     form.append('plan', this.newItinerary.plan);
  //     form.append('nationality1', this.newItinerary.nationality1);
  //     form.append('nationality2', this.newItinerary.nationality2);
  //   };
  //
  //   this.uploader.uploadAll();
  // }
}
