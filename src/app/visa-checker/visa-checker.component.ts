import {
  Component,
  OnChanges,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { CountryService } from '../shared/services/country.service';
import { Country } from 'app/shared/country.model';

@Component({
  selector: 'visa-checker',
  templateUrl: './visa-checker.component.html',
  styleUrls: ['./visa-checker.component.scss']
})
export class VisaCheckerComponent implements OnChanges {
  constructor(private countryService: CountryService) {}

  @Input() countries: Country[];
  @Output() createDataLayers: EventEmitter<any> = new EventEmitter();

  countrySelector2: any;
  countryName1: string;
  countryName2: string;
  selectedNationalityId1: string;
  selectedNationalityId2: string;

  ngOnChanges() {
    this.countrySelector2 = this.countries ? this.countries : '';
    this.countryName1 = this.countryName1 ? this.countryName1 : '';
    this.countryName2 = this.countryName2 ? this.countryName2 : '';
  }

  //********************** shows country layers *************
  selectCountries(selectedNationalityId1, selectedNationalityId2, createDataLayers) {
    const selectedCountries = [selectedNationalityId1, selectedNationalityId2];
    const colors = {
      visaFree: ['red', 'blue'],
      visaOnArrival: ['yellow', 'green']
    };
    let index = 0;
    this.showCountries(selectedCountries, colors, index, createDataLayers);
  }

  //********************   creates country data layers ***************
  showCountries(selectedCountries, colors, index, createDataLayers) {
    if (index === 2) {
      return;
    }
    this.setDataLayersForSelectedCountry(selectedCountries, index, colors, createDataLayers);
  }

  setDataLayersForSelectedCountry(selectedCountries, index, colors, createDataLayers) {
    this.countryService.get(selectedCountries[index]).subscribe(nation => {
      this.setDataLayers(
        nation,
        index,
        colors,
        selectedCountries,
        createDataLayers
      );
    });
  }

  setDataLayers(nation, index, colors, countries, createDataLayers) {
    const visaKindArray = ['visaFree', 'visaOnArrival'];
    let visaKindIndex = 0;
    let counter = 0;
    index === 0 ? (this.countryName1 = nation) : (this.countryName2 = nation);

    this.loadDataLayers(
      visaKindArray,
      visaKindIndex,
      nation,
      index,
      colors,
      counter,
      countries,
      createDataLayers
    );
  }

  loadDataLayers(
    visaKindArray: any[],
    visaKindIndex: number,
    nation: any,
    index: number,
    colors: any,
    counter: number,
    countries: any,
    createDataLayers: EventEmitter<any>
  ) {
    const visaKind = visaKindArray[visaKindIndex];
    let dataLayerData = {
      visaKind,
      nation,
      index,
      colors,
      counter
    };
    createDataLayers.emit(dataLayerData);
    counter++;
    if (counter === nation[visaKind].length) {
      counter = 0;
      if (visaKind === 'visaOnArrival') {
        index++;
        this.showCountries(countries, colors, index, createDataLayers);
      } else {
        visaKindIndex++;
        this.loadDataLayers(
          visaKindArray,
          visaKindIndex,
          nation,
          index,
          colors,
          counter,
          countries,
          createDataLayers
        );
      }
    } else {
      this.loadDataLayers(
        visaKindArray,
        visaKindIndex,
        nation,
        index,
        colors,
        counter,
        countries,
        createDataLayers
      );
    }
  }
}
