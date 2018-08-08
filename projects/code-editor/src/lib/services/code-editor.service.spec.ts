import { TestBed, inject } from '@angular/core/testing';

import { CodeEditorService } from './code-editor.service';
import { TypescriptDefaultsService } from './typescript-defaults.service';
import { JavascriptDefaultsService } from './javascript-defaults.service';

describe('CodeEditorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CodeEditorService,
        TypescriptDefaultsService,
        JavascriptDefaultsService
      ]
    });
  });

  it(
    'should be created',
    inject([CodeEditorService], (service: CodeEditorService) => {
      expect(service).toBeTruthy();
    })
  );
});
