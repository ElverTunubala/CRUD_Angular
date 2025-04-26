import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appCurrency'
})
export class CurrencyPipe implements PipeTransform {
  transform(value: number, currencyCode: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode
    }).format(value);
  }
}