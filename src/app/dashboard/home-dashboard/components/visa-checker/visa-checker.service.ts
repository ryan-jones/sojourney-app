import { Injectable } from '@angular/core';
import { SelectedCountry } from 'app/shared/models/country.model';
import {
  setVisaFreeLayers,
  createConditionalDataLayer,
  setStandardVoaLayers,
  countryXNeedsVisaLayers,
  buildUniqVisaArray
} from 'app/utils';

@Injectable()
export class VisaCheckerService {
  setSelectedCountries(nationalities: any): SelectedCountry {
    return {
      nationalities: nationalities.map(nationality => nationality.name),
      visaFree: nationalities.visaFree ? nationalities.visaFree : '',
      voa: nationalities.voa ? nationalities.voa : ''
    };
  }

  createVisaFreeLayers(selectedNationalities: any) {
    const visaFree = setVisaFreeLayers(selectedNationalities);
    visaFree.forEach(country =>
      createConditionalDataLayer(
        country,
        selectedNationalities.length > 1 ? 'purple' : 'green'
      )
    );
  }

  createVoaLayers(selectedNationalities: any, visaLimit: string) {
    const voa = setStandardVoaLayers(selectedNationalities);
    voa.forEach(country =>
      createConditionalDataLayer(
        country,
        selectedNationalities.length > 1 ? 'red' : 'orange'
      )
    );
    if (visaLimit === 'voa' && selectedNationalities.length > 1)
      this.compareDifferentVisaStatuses(selectedNationalities);
  }

  compareDifferentVisaStatuses(selectedNationalities: any) {
    const countryOneNeedsVisa = countryXNeedsVisaLayers(
      selectedNationalities,
      'visaOnArrival',
      'visaFree'
    );
    const countryTwoNeedsVisa = countryXNeedsVisaLayers(
      selectedNationalities,
      'visaFree',
      'visaOnArrival'
    );

    countryOneNeedsVisa.forEach(country =>
      createConditionalDataLayer(country, 'yellow')
    );
    countryTwoNeedsVisa.forEach(country =>
      createConditionalDataLayer(country, 'pink')
    );
  }

  createUniqueLayers(selectedNationalities: any) {
    if (selectedNationalities.length > 1) {
      const uniqVfs = buildUniqVisaArray(selectedNationalities, 'visaFree');
      const uniqVoas = buildUniqVisaArray(
        selectedNationalities,
        'visaOnArrival'
      );
      const colors = {
        vf: ['blue', 'red'],
        voa: ['yellow', 'black']
      };
      uniqVfs.forEach((vf, i) =>
        vf.forEach(country => createConditionalDataLayer(country, colors.vf[i]))
      );
      uniqVoas.forEach((voa, i) =>
        voa.forEach(country =>
          createConditionalDataLayer(country, colors.voa[i])
        )
      );
    }
  }
}
