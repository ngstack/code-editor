import { TestBed } from '@angular/core/testing';
import { TranslatePipe } from './translate.pipe';
import { TranslateService } from './translate.service';
import { HttpClientModule } from '@angular/common/http';

describe('TranslatePipe', () => {
  let translate: TranslateService;
  let pipe: TranslatePipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [TranslateService]
    });

    translate = TestBed.get(TranslateService);
    pipe = new TranslatePipe(translate);
  });

  it('should use translate service to transform value', () => {
    spyOn(translate, 'get').and.returnValue('bonjour');

    const result = pipe.transform('hello');
    expect(result).toEqual('bonjour');
  });

  it('should use translate params to transform value', () => {
    spyOn(translate, 'get').and.returnValue('bonjour');

    const params = { some: 'param' };
    const result = pipe.transform('hello', params);

    expect(translate.get).toHaveBeenCalledWith('hello', params);
    expect(result).toEqual('bonjour');
  });
});
