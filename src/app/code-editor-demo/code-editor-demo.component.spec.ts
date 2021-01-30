import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CodeEditorDemoComponent } from './code-editor-demo.component';
import { CodeEditorModule } from '@ngstack/code-editor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../material.module';

describe('CodeEditorDemoComponent', () => {
  let component: CodeEditorDemoComponent;
  let fixture: ComponentFixture<CodeEditorDemoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MaterialModule,
        CodeEditorModule.forRoot()
      ],
      declarations: [CodeEditorDemoComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeEditorDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
