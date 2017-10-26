import {
  Component,
  OnChanges,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { Country } from 'app/shared/country.model';
import { buildDataLayer, initializeDataLayer, COLORS } from 'app/utils';
import { DataLayer, Colors } from 'app/shared/map.model';

@Component({
  selector: 'visa-checker',
  templateUrl: './visa-checker.component.html',
  styleUrls: ['./visa-checker.component.scss']
})
export class VisaCheckerComponent implements OnChanges {
  constructor() {}

  // @Input() countries: Country[];
  @Input() countries$: Country[];
  @Output() createDataLayers: EventEmitter<any> = new EventEmitter();

  dataLayer: DataLayer;
  colors: Colors = COLORS;
  countrySelector2: Country[];
  countryName1: string;
  countryName2: string;
  selectedNationalityId1: string;
  selectedNationalityId2: string;

  ngOnChanges() {
    this.countrySelector2 = this.countries$;
    this.countryName1 = this.countryName1 ? this.countryName1 : '';
    this.countryName2 = this.countryName2 ? this.countryName2 : '';
  }

  selectCountries(
    selectedNationalityId1: string,
    selectedNationalityId2: string
  ) {
    const selectedCountries = [selectedNationalityId1, selectedNationalityId2];
    let index = 0;
    this.showCountries(selectedCountries, this.colors, index);
  }

  showCountries(selectedCountries: string[], colors: Colors, index: number) {
    if (index === 2) {
      return;
    }
    this.setLayersForSelectedCountry(selectedCountries, index, colors);
  }

  setLayersForSelectedCountry(
    selectedCountries: string[],
    index: number,
    colors: Colors
  ) {
    const nation = this.countries$.find(
      country => country._id === selectedCountries[index]
    );
    this.setDataLayers(nation, index, colors, selectedCountries);
  }

  setDataLayers(
    nation: any,
    index: number,
    colors: Colors,
    countries: string[]
  ) {
    index === 0 ? (this.countryName1 = nation) : (this.countryName2 = nation);
    this.dataLayer = initializeDataLayer(nation, index, colors, countries);
    this.loadDataLayers(this.dataLayer);
  }

  loadDataLayers(dataLayer: DataLayer) {
    this.emitDataLayer(dataLayer);
    dataLayer.counter++;
    this.checkCountryIndexValues(dataLayer);
  }

  emitDataLayer(dataLayer: DataLayer) {
    const currentDataLayerData = buildDataLayer(dataLayer);
    this.createDataLayers.emit(currentDataLayerData);
  }

  checkCountryIndexValues(layer: DataLayer) {
    const visaKind = layer.visaKindArray[layer.visaKindIndex];

    if (layer.counter === layer.nation[visaKind].length) {
      layer.counter = 0;
      if (visaKind === 'visaOnArrival') {
        layer.index++;
        this.showCountries(layer.countries, layer.colors, layer.index);
      } else {
        layer.visaKindIndex++;
        this.loadDataLayers(layer);
      }
    } else {
      this.loadDataLayers(layer);
    }
  }
}
