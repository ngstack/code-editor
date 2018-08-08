import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeEditorDemoComponent } from './code-editor-demo.component';
import { CodeEditorModule } from '@ngstack/code-editor';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CodeEditorDemoComponent', () => {
  let component: CodeEditorDemoComponent;
  let fixture: ComponentFixture<CodeEditorDemoComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          BrowserAnimationsModule,
          CodeEditorModule.forRoot(),
          MatSelectModule
        ],
        declarations: [CodeEditorDemoComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeEditorDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
