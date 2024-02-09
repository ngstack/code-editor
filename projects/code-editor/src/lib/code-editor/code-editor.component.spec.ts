import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { CodeEditorComponent } from './code-editor.component';
import { CodeEditorService } from '../services/code-editor.service';
import { TypescriptDefaultsService } from '../services/typescript-defaults.service';
import { JavascriptDefaultsService } from '../services/javascript-defaults.service';
import { CodeEditorModule } from '../code-editor.module';

describe('CodeEditorComponent', () => {
  let component: CodeEditorComponent;
  let fixture: ComponentFixture<CodeEditorComponent>;
  let codeEditorService: CodeEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CodeEditorModule.forRoot({ baseUrl: 'assets/monaco' })],
      providers: [
        CodeEditorService,
        TypescriptDefaultsService,
        JavascriptDefaultsService
      ]
    });

    codeEditorService = TestBed.inject(CodeEditorService);
    spyOn(codeEditorService, 'createEditor').and.stub();
    spyOn(codeEditorService, 'createModel').and.returnValue({
      onDidChangeContent: () => {},
      dispose: () => {}
    } as any);

    fixture = TestBed.createComponent(CodeEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
