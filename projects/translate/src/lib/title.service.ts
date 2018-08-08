import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from './translate.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  private _titleKey = '';

  changed = new Subject<{
    previousValue: string;
    currentValue: string;
  }>();

  constructor(private title: Title, private translate: TranslateService) {
    translate.activeLangChanged.subscribe(() => this.onLanguageChanged());
  }

  getTitle(): string {
    return this._titleKey;
  }

  setTitle(key: string): void {
    const previousValue = this._titleKey;
    const newValue = key || '';
    const changed = newValue !== previousValue;

    if (changed) {
      this._titleKey = newValue;

      const translated = this.translate.get(newValue);
      this.title.setTitle(translated);

      this.changed.next({
        previousValue: previousValue,
        currentValue: newValue
      });
    }
  }

  private onLanguageChanged() {
    if (this._titleKey) {
      const translated = this.translate.get(this._titleKey);
      this.title.setTitle(translated);
    }
  }
}
