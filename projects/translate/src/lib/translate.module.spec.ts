import { TranslateModule } from './translate.module';

describe('TranslateModule', () => {
  it('should work', () => {
    expect(new TranslateModule()).toBeDefined();
  });

  it('should return module with providers for root import', () => {
    const module = TranslateModule.forRoot();
    expect(module.providers).toBeDefined();
    expect(module.providers.length > 0).toBeTruthy();
  });

  it('should return module without providers for child import', () => {
    const module = TranslateModule.forChild();
    expect(module.providers).not.toBeDefined();
  });
});
