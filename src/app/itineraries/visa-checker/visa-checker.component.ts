import {
  Component,
  OnChanges,
  Input,
  EventEmitter,
  Output
} from '@angular/core';
import { Country } from 'app/shared/models/country.model';
import { CountryLayersService } from 'app/shared/services/country-layers.service';

@Component({
  selector: 'visa-checker',
  templateUrl: './visa-checker.component.html',
  styleUrls: ['./visa-checker.component.scss']
})
export class VisaCheckerComponent implements OnChanges {
  constructor(private countryService: CountryLayersService) {}

  @Input() countries$: Country[];
  @Output() onRetrieveCountryNames: EventEmitter<any> = new EventEmitter<any>();
  countrySelector2: Country[];
  countryName1: string;
  countryName2: string;
  selectedNationalityId1: string;
  selectedNationalityId2: string;
  searchterm: string;
  selectedNationalities: string[]

  ngOnChanges() {
    this.countrySelector2 = this.countries$;
  }

  selectCountries(
    selectedNationalityId1: string,
    selectedNationalityId2: string
  ) {
    const selectedCountries = [selectedNationalityId1, selectedNationalityId2];
    let index = 0;
    this.countryService.createDataLayersForDisplay(selectedCountries);
    this.setCountryNames();
  }

  setCountryNames() {
    const countries = {
      countryName1: this.countryService.countryName1,
      countryName2: this.countryService.countryName2
    };
    this.onRetrieveCountryNames.emit(countries);
  }

  onAddNationality(input) {
    this.selectedNationalities.push(input);
    this.resetValues();
  }

  filterNationalities(input) {
    console.log('input', input)
    this.searchterm = input;
  }

  resetValues() {
    this.searchterm = '';
  }

  onDeleteNationalityFromList(country) {
    this.selectedNationalities = this.selectedNationalities.filter(nationality => {
      return nationality !== country;
    });
  }
}
