import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideCodeEditor } from '@ngstack/code-editor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    // provideRouter(routes),
    provideAnimationsAsync(),
    provideCodeEditor({
      // editorVersion: '0.46.0',
      // use local Monaco installation
      baseUrl: 'assets/monaco',
      // use local Typings Worker
      typingsWorkerUrl: 'assets/workers/typings-worker.js'
    })
  ]
};
