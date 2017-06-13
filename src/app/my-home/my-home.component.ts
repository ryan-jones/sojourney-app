import { Component,OnInit } from '@angular/core';
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



  newItinerary = {
    id: '',
    name: '',
    details: '',
    nationality1: '',
    nationality2: '',
    placesAndDates: [],
  };


  selectedNationalityId1;
  selectedNationalityId2;
  user;
  countries;
  countries2;
  warnings;
  nation;
  nation2;
  countryName1;
  countryName2;
  freeLayer;
  freeLayer2;
  address;
  geocoder;
  flightPath;
  totalItinerary;
  deleteLocation;
  marker;
  indexTarget;
  locationIndex;
  namePlaceholder;
  locationPlaceholder;
  locationView;
  passableValue;
  currentCost;
  arrow;
  checked: boolean = false;
  isCollapsed:boolean = false;
  feedback:string;
  map: any;
  diffDays: number;
  place: any;
  placeExpenditure: any;
  sum: any;
  price: any;
  newAddress: any;
  newPrice: any;
  newCurrency: any;
  newTransport: any;

  arrayOfTravel = [];
  dates = [];
  locations: Array<any> = [];
  itineraryDays: Array<any>=[];
  itineraryPrice: Array<any>=[];
  allMarkers: Array<any> = [];
  allFlightPaths: Array<any> = [];
  allTravelArray: Array<any> = [];
  colorLayers: Array<any> = [];
  layers: Array<any> = [];
  totalCostArray: Array<any> = [];
  expenseArray: Array<any> = [];




  constructor(private country: CountryService, private status: WarningService, private session: SessionService, private userService: UserService) { }



  ngOnInit() {

    this.namePlaceholder = "Create an itinerary name"
    this.locationPlaceholder = "Enter a starting location";

    this.initiateMap();


    let user = JSON.parse(localStorage.getItem("user"))
    console.log('THE ID', user)
    if (user === null){
      this.user = ''
    } else {
      this.userService.get(user._id)
        .subscribe((user)=> {
              this.user = user
            });
        }

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

      if (!this.isCollapsed){
        this.arrow = ">"
      } else{
        this.arrow = "v"
      }
      // this.status.getList()
      //   .subscribe((warnings)=>{
      //     this.warnings = warnings;
      //   })
      //   console.log(this.warnings);

      this.sum = 0;
      this.price = 0;
      this.currentCost = 0;
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

     this.place = {};
     let input = document.getElementById('new-address');
     let autocomplete = new google.maps.places.Autocomplete(input);

     autocomplete.addListener("place_changed", ()=> {

     this.place = autocomplete.getPlace()
     this.locationView = this.place.name;
     console.log("this.place", this.place)
     })
     this.newCurrency = "$";
     this.newTransport = "plane";
     this.checked = false;
  }

//**************** total days*********************
totalDays(){
  var total = this.itineraryDays.reduce((a, b) => a + b, 0);

  if(total === 0 || total === NaN || total === undefined){
    this.sum === 0;
    return this.sum;
  } else{
    this.sum = total;
    return this.sum;
  }

}

//********************* Create cost total *********************
totalPrice(){


    let totalPrice = this.itineraryPrice.reduce((a, b) => a + b, 0);
    if(totalPrice == 0 || totalPrice === NaN || totalPrice === undefined){
      this.price = 0;
    } else{
      this.price = totalPrice;
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

          if(index== 0){
            this.countryName1 = this.nation;
          } else {
            this.countryName2 = this.nation;
          }

          var self = this

          let visaKindArray = ['visaFree', 'visaOnArrival' ];
          let visaKindIndex = 0;
          let counter = 0;
          var test = 0;

          function starter(visaKind){

          let freeLayer = new google.maps.Data();

          freeLayer.loadGeoJson('https://raw.githubusercontent.com/johan/world.geo.json/master/countries/' + self.nation[visaKind][counter] + '.geo.json');
          freeLayer.setStyle({ fillColor: colorsArray[visaKind][index], fillOpacity: 0.5, title: self.nation[visaKind][counter]});

          freeLayer.setMap(self.map);
          counter++

          self.layers.push(freeLayer)


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


  //*************** Creates a point/polyline on the map **********
    createPoint(){

      // checks to see if there are any details/notes for the itinerary
      if (this.expenseArray.length === 0){
        this.place.details = '';
      } else {
        this.place.details = this.expenseArray;
      }

      //assigns currency and transport method
      this.place.currency = this.newCurrency;
      this.place.transport = this.newTransport;

      if(this.place.transport == null || this.place.transport == undefined){
        this.place.transport = "plane";
      }

      //get country value
      let countryStringSplit = this.place.formatted_address.split(',');
      this.place.country = countryStringSplit[countryStringSplit.length-1];


      // price input field
      if (this.totalCostArray.length === 0){
        this.place.price = document.getElementById('new-price')['valueAsNumber'];
        this.currentCost = this.place.price;
      } else{
        this.place.price = this.currentCost;
      }

      if (isNaN(this.place.price)){
        this.place.price = 0;
      }
      if (isNaN(this.currentCost)){
        this.currentCost = 0;
      }

      this.itineraryPrice.push(this.place.price);
      this.totalPrice();


      //add place to the locations array(used to create itinerary) and newItinerary object (used for saving itinerary)
      this.locations.push(this.place);
      this.newItinerary.placesAndDates.push(this.place);


      //date input field
      let variableDate = document.getElementById('new-date')['valueAsDate'];
      let dateLength = variableDate.getMonth()
      if(dateLength <= 8){
        this.place.date = variableDate.getDate() + '/0' + (variableDate.getMonth()+1) + '/' + variableDate.getFullYear();
      } else{
        this.place.date = variableDate.getDate() + '/' + (variableDate.getMonth()+1) + '/' + variableDate.getFullYear();
      }
      this.place.date.autocomplete;
      this.dates.push(this.place.date);


      //turns dates into numerical values for comparison
      if(this.dates.length >=0){
        this.diffDays = (Math.abs(new Date(this.dates[this.dates.length-1]).getTime() - new Date(this.dates[this.dates.length - 2]).getTime())) / (1000 * 3600 * 24);
        if(isNaN(this.diffDays)){
          this.diffDays = 0;
        }
      }

      //array of differences between dates to be loaded on the view
      this.itineraryDays.push(this.diffDays);
      this.totalDays();



      //geocodes the address, creates a marker and polyline segment
      this.geocoder = new google.maps.Geocoder();
      let that = this;
  	  this.address = this.newAddress;

  	  this.geocoder.geocode({'address': this.address}, function(results, status) {

  	     if (status === 'OK') {
           var point = {lat: that.place.geometry.location.lat(), lng: that.place.geometry.location.lng()}
           let infowindow = new google.maps.InfoWindow();
           let name = that.place.name;
           let country = that.place.country;
           let date = that.place.date;
           let days = that.diffDays;
           let transport = that.place.transport;
           let price = that.place.price;

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
             map: that.map,
             name: name,
             country: country,
             date: date,
             days: days,
             transport: transport,
             price: price
           })


           that.marker.setIcon('http://maps.google.com/mapfiles/ms/icons/yellow-dot.png')
           that.allMarkers.push(that.marker)

           if(that.locations.length == 1){
             google.maps.event.addListener(that.marker, 'click', function(){
                infowindow.setContent(`<div><h3> Starting in ${name}, ${country} </h3></div>`);
                infowindow.open(that.map, this);
                console.log(infowindow);
              });
           } else{
               google.maps.event.addListener(that.marker, 'click', function(){
                  infowindow.setContent(`<div><h3> Location: ${name}, ${country} </h3></div><div><p><strong>Arriving on Day </strong> ${days} <strong> of the trip </strong></p></div> <div><p><strong>Arriving on </strong> ${date}  via  <i>${transport}</i> </p></div><div><p><strong>Price: </strong>  ${price} per person  </p></div> `);
                  infowindow.open(that.map, this);
                  console.log(infowindow);
                });
           }


  	     } else {
  	       alert('Geocode was not successful for the following reason: ' + status);
  	     }
  	  });

      let note = document.getElementById("new-note");
      if(note !== null){
        document.getElementById("new-note")["value"] = '';
      }
      document.getElementById("new-price")["value"] = '';

      this.newAddress = '';
      this.expenseArray= [];
      this.totalCostArray = [];
      this.namePlaceholder = "Edit itinerary name"
      this.locationPlaceholder = "Add a location";
      this.locationView = '';
      this.currentCost = 0;

    }


  deletePoint(locationInput){

    // clear polylines and reset allFlightPaths array
    this.allFlightPaths.forEach((flightPath)=>{
      flightPath.setMap(null)
    })
    this.allFlightPaths = []

    //clear markers and reset allMarkers array
    this.allMarkers.forEach((marker)=>{
       marker.setMap(null);
    })
    this.allMarkers = [];

    //delete selected location from itinerary list
    this.locations = this.locations.filter((savedLocation)=>{
      return savedLocation.id != locationInput.value
    })

    //reconfigures the total number of days
    this.dates=[];
    this.itineraryDays = [];
    this.locations.forEach((place)=>{
      this.dates.push(place.date);
    })
    this.updateTotalDays();
    this.totalDays();


    //reconfigures the total price of trip
    this.itineraryPrice = [];
    this.locations.forEach((place)=>{
      this.itineraryPrice.push(place.price);
    })
    this.totalPrice();

    //creates new polyline path and markers
    this.arrayOfTravel = [];
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


//*********** whenever a user deletes a value from the itinerary
  updateTotalDays(){
    if(this.dates.length >=0){
      this.dates.forEach((day) =>{
        let dayIndex = this.dates.indexOf(day);
        this.diffDays = (Math.abs(new Date(this.dates[dayIndex]).getTime() - new Date(this.dates[dayIndex-1]).getTime())) / (1000 * 3600 * 24);
        if(isNaN(this.diffDays)){
          this.diffDays = 0;
        }
        this.itineraryDays.push(this.diffDays);
      })

    }
    return this.itineraryDays;
  }


//toggles on and off note option for itinerary***********************
   toggleNote(){
     if (this.checked === false){
       this.checked = true;
     } else {
       this.checked = false;
     }
   }


//adds expense to a single location in the itinerary*********************
   addExpense(){
     let newestExpense = {
       note: '',
       expense: Number,
       transport: ''
     };

     newestExpense.expense = document.getElementById('new-price')['valueAsNumber'];
     newestExpense.transport = document.getElementById('new-transport')['value']

     if (document.getElementById('new-note') == null){
       newestExpense.note = '';
     } else {
       newestExpense.note = document.getElementById('new-note')['value'];
     }
     this.expenseArray.push(newestExpense);
     console.log("after", this.expenseArray);

     this.totalCostArray.push(newestExpense.expense);



     let newTotalExpense = this.totalCostArray.reduce((a, b) => a + b, 0);

     if(document.getElementById("new-note") !== null){
       document.getElementById("new-note")["value"] = '';
     }
     document.getElementById("new-price")["value"] = '';

     if(newTotalExpense === 0 || newTotalExpense === NaN || newTotalExpense === undefined){
       this.currentCost === 0;
       return this.currentCost;
     } else{
       this.currentCost = newTotalExpense;
       return this.currentCost;
     }

   }

  //delete expense from list
  deleteExpense(){
    this.expenseArray.pop();
    this.totalCostArray.pop();

    let newTotalExpense = this.totalCostArray.reduce((a, b) => a + b, 0);
    console.log("newTotalExpense", newTotalExpense);
    if(document.getElementById("new-note") !== null){
      document.getElementById("new-note")["value"] = '';
    }
    document.getElementById("new-price")["value"] = '';

    if(newTotalExpense == 0 || newTotalExpense === NaN || newTotalExpense === undefined){
      this.currentCost = 0;
      return this.currentCost;
    } else{
      this.currentCost = newTotalExpense;
      return this.currentCost;
    }
  }
//saving to user profile in the database
  addItinerary(){
    this.newItinerary.id = this.user._id
    this.newItinerary.nationality1 = this.selectedNationalityId1;
    this.newItinerary.nationality2 = this.selectedNationalityId2;

    this.userService.editItinerary(this.newItinerary)
    .subscribe((user)=>{
      this.user = user;
      console.log("user", user);
      alert("Itinerary saved! View in your user profile.");
    })
  }


}
