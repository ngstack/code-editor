import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CodeEditorModule } from '@ngstack/code-editor';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CodeEditorModule.forRoot({
      // use local Monaco installation
      baseUrl: 'assets/monaco',
      // use local Typings Worker
      typingsWorkerUrl: 'assets/workers/typings-worker.js',
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
