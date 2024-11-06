import { APP_INITIALIZER, ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeEditorComponent } from './code-editor/code-editor.component';
import { CodeEditorService, EDITOR_SETTINGS } from './services/code-editor.service';
import { CodeEditorSettings } from './editor-settings';
import { TypescriptDefaultsService } from './services/typescript-defaults.service';
import { JavascriptDefaultsService } from './services/javascript-defaults.service';
import { JsonDefaultsService } from './services/json-defaults.service';

export function setupEditorService(service: CodeEditorService) {
  return () => service.loadEditor();
}

export function provideCodeEditor(settings?: CodeEditorSettings): Provider[] {
  return [
    { provide: EDITOR_SETTINGS, useValue: settings },
    CodeEditorService,
    TypescriptDefaultsService,
    JavascriptDefaultsService,
    JsonDefaultsService,
    {
      provide: APP_INITIALIZER,
      useFactory: setupEditorService,
      deps: [CodeEditorService],
      multi: true,
    },
  ];
}

/** @deprecated use `provideCodeEditor(settings)` instead */
@NgModule({
  imports: [CommonModule, CodeEditorComponent],
  exports: [CodeEditorComponent],
})
export class CodeEditorModule {
  static forRoot(
    settings?: CodeEditorSettings
  ): ModuleWithProviders<CodeEditorModule> {
    return {
      ngModule: CodeEditorModule,
      providers: [
        { provide: EDITOR_SETTINGS, useValue: settings },
        CodeEditorService,
        {
          provide: APP_INITIALIZER,
          useFactory: setupEditorService,
          deps: [CodeEditorService],
          multi: true,
        },
      ],
    };
  }
}
