import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateDemoComponent } from './translate-demo.component';
import { TranslateModule } from '@ngstack/translate';
import { CustomTranslatePipe } from './custom-translate.pipe';

describe('TranslateDemoComponent', () => {
  let component: TranslateDemoComponent;
  let fixture: ComponentFixture<TranslateDemoComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot()],
        declarations: [CustomTranslatePipe, TranslateDemoComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslateDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
