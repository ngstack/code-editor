import { TestBed, inject } from '@angular/core/testing';

import { TitleService } from './title.service';
import { Title } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { TranslateService } from './translate.service';

describe('TitleService', () => {
  let titleService: TitleService;
  let translateService: TranslateService;
  let title: Title;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [TitleService, TranslateService, Title]
    });

    translateService = TestBed.get(TranslateService);
    translateService.use('en', { APP: { TITLE: '[en] title' } });
    translateService.use('it', { APP: { TITLE: '[it] title' } });
    translateService.activeLang = 'en';

    titleService = TestBed.get(TitleService);
    title = TestBed.get(Title);
  });

  it('should set application title for active locale', () => {
    titleService.setTitle('APP.TITLE');

    expect(titleService.getTitle()).toBe('APP.TITLE');
    expect(title.getTitle()).toEqual('[en] title');
  });

  it('should use original string if no resources present', () => {
    titleService.setTitle('My custom title');

    expect(titleService.getTitle()).toBe('My custom title');
    expect(title.getTitle()).toEqual('My custom title');
  });

  it('should raise [changed] event upon setting new title', done => {
    titleService.changed.subscribe(() => done());
    titleService.setTitle('APP.TITLE');
  });

  it('should raise [changed] event only for new title', () => {
    titleService.setTitle('APP.TITLE');
    spyOn(titleService.changed, 'next').and.callThrough();

    titleService.setTitle('APP.TITLE');
    titleService.setTitle('APP.TITLE');
    expect(titleService.changed.next).not.toHaveBeenCalled();
  });

  it('should provide old and new values for [changed] event', done => {
    titleService.setTitle('APP.TITLE');

    titleService.changed.subscribe(event => {
      expect(event.previousValue).toBe('APP.TITLE');
      expect(event.currentValue).toBe('NEW.APP.TITLE');
      done();
    });

    titleService.setTitle('NEW.APP.TITLE');
  });

  it('should auto-update title on language change', done => {
    titleService.setTitle('APP.TITLE');
    expect(title.getTitle()).toEqual('[en] title');

    translateService.activeLangChanged.subscribe(() => {
      expect(title.getTitle()).toEqual('[it] title');
      done();
    });
    translateService.activeLang = 'it';
  });

  it('should use default behaviour for missing title value', () => {
    titleService.setTitle('APP.TITLE');
    expect(title.getTitle()).toEqual('[en] title');

    titleService.setTitle(null);
    expect(title.getTitle()).toEqual('');
  });

  it('should not update title on language change if not configured', done => {
    spyOn(title, 'setTitle').and.callThrough();

    translateService.activeLangChanged.subscribe(() => {
      expect(title.setTitle).not.toHaveBeenCalled();
      done();
    });
    translateService.activeLang = 'it';
  });
});
