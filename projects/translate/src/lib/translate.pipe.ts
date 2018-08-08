import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService, TranslateParams } from './translate.service';

@Pipe({
  name: 'translate',
  pure: false
})
export class TranslatePipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(key: string, params?: TranslateParams): string {
    return this.translate.get(key, params);
  }
}
