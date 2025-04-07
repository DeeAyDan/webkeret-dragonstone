import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatPipe',
  standalone: true
})
export class FormatPipePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
