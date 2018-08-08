import {
  NgModule,
  ModuleWithProviders,
  InjectionToken,
  APP_INITIALIZER
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeEditorComponent } from './code-editor/code-editor.component';
import { CodeEditorService } from './services/code-editor.service';
import { TypescriptDefaultsService } from './services/typescript-defaults.service';
import { JavascriptDefaultsService } from './services/javascript-defaults.service';
import { CodeEditorSettings } from './editor-settings';
import { JsonDefaultsService } from './services/json-defaults.service';

export const EDITOR_SETTINGS = new InjectionToken<CodeEditorSettings>(
  'EDITOR_SETTINGS'
);

export function setupCodeEditorService(
  service: CodeEditorService,
  settings: CodeEditorSettings
): Function {
  return () =>
    new Promise(resolve => {
      if (settings.baseUrl) {
        service.baseUrl = settings.baseUrl;
      }
      if (settings.typingsWorkerUrl) {
        service.typingsWorkerUrl = settings.typingsWorkerUrl;
      }
      resolve(true);
    });
}

@NgModule({
  imports: [CommonModule],
  declarations: [CodeEditorComponent],
  exports: [CodeEditorComponent]
})
export class CodeEditorModule {
  static forRoot(settings?: CodeEditorSettings): ModuleWithProviders {
    settings = settings || {};
    return {
      ngModule: CodeEditorModule,
      providers: [
        { provide: EDITOR_SETTINGS, useValue: settings },
        CodeEditorService,
        {
          provide: APP_INITIALIZER,
          useFactory: setupCodeEditorService,
          deps: [CodeEditorService, EDITOR_SETTINGS],
          multi: true
        },
        TypescriptDefaultsService,
        JavascriptDefaultsService,
        JsonDefaultsService
      ]
    };
  }

  static forChild(): ModuleWithProviders {
    return {
      ngModule: CodeEditorModule
    };
  }
}
