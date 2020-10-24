import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeEditorComponent } from './code-editor.component';
import { CodeEditorService } from '../services/code-editor.service';
import { TypescriptDefaultsService } from '../services/typescript-defaults.service';
import { JavascriptDefaultsService } from '../services/javascript-defaults.service';
import { CodeEditorModule } from '../code-editor.module';

describe('CodeEditorComponent', () => {
  let component: CodeEditorComponent;
  let fixture: ComponentFixture<CodeEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CodeEditorModule.forRoot()],
    });

    fixture = TestBed.createComponent(CodeEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
