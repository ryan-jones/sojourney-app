import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'
})
@Injectable()
export class SearchFilterPipe implements PipeTransform {
  transform(inputs: any, searchTerm: any): any {
    if (inputs) {
      if (inputs.length === 0 || !searchTerm) {
        return inputs;
      }
      return inputs.filter(input => {
        return input.name.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }
  }
}