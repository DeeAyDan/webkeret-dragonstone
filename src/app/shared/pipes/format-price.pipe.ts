import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatPrice',
  standalone: true
})
export class FormatPricePipe implements PipeTransform {

  transform(value: number | undefined | null, currencySymbol: string = '€ '): string {
    if (value === null || value === undefined || isNaN(value)) {
      return `${currencySymbol}0.00`;
    }
    return `${currencySymbol}${value.toFixed(2)}`;
  }

}
