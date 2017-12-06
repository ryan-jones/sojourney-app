import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { Country, CountryIcon } from 'app/shared/models/country.model';
import { CountryLayersService } from 'app/shared/services/country-layers.service';
import { removeWhiteSpace, removeDataLayer } from 'app/utils';
import { VisaCheckerService } from 'app/dashboard/home-dashboard/components/visa-checker/visa-checker.service';

@Component({
  selector: 'visa-checker',
  templateUrl: './visa-checker.component.html',
  styleUrls: ['./visa-checker.component.scss']
})
export class VisaCheckerComponent implements OnInit {
  countries: Country[];
  countrySelector2: Country[];
  countryName1: string;
  countryName2: string;
  searchterm: string;
  inputValue: string;
  visaLimit = 'all';
  selectedNationalities: any[] = [];

  constructor(
    private countryService: CountryLayersService,
    private visaCheckService: VisaCheckerService
  ) {}

  ngOnInit() {
    this.countryService.countries$.subscribe((res: Country[]) => {
      this.countries = this.countrySelector2 = res;
    });
    this.countryService.countryName1.subscribe(
      (res: string) => (this.countryName1 = res)
    );
    this.countryService.countryName2.subscribe(
      (res: string) => (this.countryName2 = res)
    );
  }

  onAddNationality(input: CountryIcon) {
    const nationality = Object.assign({}, input);
    const flagName = removeWhiteSpace(nationality.name);
    nationality.img = `./assets/${flagName}.svg`;
    this.selectedNationalities.push(nationality);
    this.displaySelectedVisaView();
  }

  displaySelectedVisaView() {
    switch (this.visaLimit) {
      case 'all':
        this.setAllVisas();
        this.resetValues();
        break;
      case 'visa-free':
        this.setVisaFree();
        this.resetValues();
        break;
      case 'voa':
        this.setVOA();
        this.resetValues();
        break;
    }
  }

  selectCountries(nationalities: any) {
    removeDataLayer();
    const selectedCountries = this.visaCheckService.setSelectedCountries(
      nationalities
    );
    this.countryService.createDataLayersForDisplay(selectedCountries);
  }

  setVisaFree() {
    removeDataLayer();
    this.visaCheckService.createVisaFreeLayers(this.selectedNationalities);
  }

  setVOA() {
    removeDataLayer();
    this.visaCheckService.createVoaLayers(
      this.selectedNationalities,
      this.visaLimit
    );
    this.visaCheckService.createVisaFreeLayers(this.selectedNationalities);
  }

  setAllVisas() {
    removeDataLayer();
    this.visaCheckService.createVoaLayers(
      this.selectedNationalities,
      this.visaLimit
    );
    this.visaCheckService.createVisaFreeLayers(this.selectedNationalities);
    this.visaCheckService.createUniqueLayers(this.selectedNationalities);
  }

  filterNationalities(input: string) {
    this.searchterm = input;
  }

  resetValues() {
    this.searchterm = '';
    this.inputValue = '';
  }

  onDeleteNationalityFromList(country: any) {
    this.selectedNationalities = this.selectedNationalities.filter(
      nationality => {
        return nationality !== country;
      }
    );
    this.displaySelectedVisaView();
  }

  setVisaLimits(input: string) {
    this.visaLimit = input;
    if (this.selectedNationalities.length) {
      removeDataLayer();
      this.displaySelectedVisaView();
    }
  }
}
