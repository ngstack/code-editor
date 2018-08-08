import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngstack/translate';

@Pipe({
  name: 'myTranslate',
  pure: false
})
export class CustomTranslatePipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(key: string, params?: { [key: string]: string }): string {
    return this.translate.get(key, params);
  }
}
