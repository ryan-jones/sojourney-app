import {
  Component,
  OnChanges,
  Input
} from '@angular/core';
import { Country } from 'app/shared/country.model';
import { CountryService } from 'app/shared/services/countries.service';

@Component({
  selector: 'visa-checker',
  templateUrl: './visa-checker.component.html',
  styleUrls: ['./visa-checker.component.scss']
})
export class VisaCheckerComponent implements OnChanges {
  constructor(private countryService: CountryService) {}

  @Input() countries$: Country[];

  countrySelector2: Country[];
  countryName1: string;
  countryName2: string;
  selectedNationalityId1: string;
  selectedNationalityId2: string;

  ngOnChanges() {
    this.countrySelector2 = this.countries$;
    this.countryName1 = this.countryService.countryName1 ? this.countryService.countryName1 : '';
    this.countryName2 = this.countryService.countryName2 ? this.countryService.countryName2 : '';
  }

  selectCountries(
    selectedNationalityId1: string,
    selectedNationalityId2: string
  ) {
    const selectedCountries = [selectedNationalityId1, selectedNationalityId2];
    let index = 0;
    this.countryService.createDataLayersForDisplay(selectedCountries)
  }
}
