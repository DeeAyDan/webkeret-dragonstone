import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(value: string | number | Date, format: 'YYYY-MM-DD' | 'MM/DD/YYYY' = 'YYYY-MM-DD'): string {
    if (!value) return '';

    const date = new Date(value);
    if (isNaN(date.getTime())) return '';

    const year = date.getFullYear();
    const month = this.padZero(date.getMonth() + 1);
    const day = this.padZero(date.getDate());

    if (format === 'MM/DD/YYYY') {
      return `${month}/${day}/${year}`;
    }

    return `${year}-${month}-${day}`;
  }

  private padZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

}
