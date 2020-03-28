import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeEditorComponent } from './code-editor/code-editor.component';
import {
  CodeEditorService,
  EDITOR_SETTINGS
} from './services/code-editor.service';
import { TypescriptDefaultsService } from './services/typescript-defaults.service';
import { JavascriptDefaultsService } from './services/javascript-defaults.service';
import { CodeEditorSettings } from './editor-settings';
import { JsonDefaultsService } from './services/json-defaults.service';

@NgModule({
  imports: [CommonModule],
  declarations: [CodeEditorComponent],
  exports: [CodeEditorComponent]
})
export class CodeEditorModule {
  static forRoot(settings?: CodeEditorSettings): ModuleWithProviders<CodeEditorModule> {
    return {
      ngModule: CodeEditorModule,
      providers: [
        { provide: EDITOR_SETTINGS, useValue: settings },
        CodeEditorService,
        TypescriptDefaultsService,
        JavascriptDefaultsService,
        JsonDefaultsService
      ]
    };
  }

  static forChild(): ModuleWithProviders<CodeEditorModule> {
    return {
      ngModule: CodeEditorModule
    };
  }
}
