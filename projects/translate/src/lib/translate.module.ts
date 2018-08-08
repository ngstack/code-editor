import {
  NgModule,
  ModuleWithProviders,
  InjectionToken,
  APP_INITIALIZER
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TranslateService } from './translate.service';
import { TranslatePipe } from './translate.pipe';
import { TitleService } from './title.service';
import { TranslateSettings } from './translate.settings';

export const TRANSLATE_SETTINGS = new InjectionToken<TranslateSettings>(
  'TRANSLATE_SETTINGS'
);

export function setupTranslateService(
  service: TranslateService,
  settings: TranslateSettings
): Function {
  return () => {
    if (settings.debugMode === true) {
      service.debugMode = true;
    }
    if (settings.disableCache === true) {
      service.disableCache = true;
    }
    if (settings.supportedLangs) {
      service.supportedLangs = settings.supportedLangs;
    }
    if (settings.translatePaths) {
      service.translatePaths = settings.translatePaths;
    }
    if (settings.translationRoot) {
      service.translationRoot = settings.translationRoot;
    }
    if (settings.activeLang) {
      service.activeLang = settings.activeLang;
    }
    return service.use(service.activeLang);
  };
}

@NgModule({
  imports: [CommonModule, HttpClientModule],
  declarations: [TranslatePipe],
  exports: [TranslatePipe]
})
export class TranslateModule {
  static forRoot(settings?: TranslateSettings): ModuleWithProviders {
    settings = settings || {};
    return {
      ngModule: TranslateModule,
      providers: [
        { provide: TRANSLATE_SETTINGS, useValue: settings },
        TranslateService,
        {
          provide: APP_INITIALIZER,
          useFactory: setupTranslateService,
          deps: [TranslateService, TRANSLATE_SETTINGS],
          multi: true
        },
        TitleService
      ]
    };
  }

  static forChild(): ModuleWithProviders {
    return {
      ngModule: TranslateModule
    };
  }
}
