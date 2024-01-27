import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Route } from '@angular/router';
import { CodeEditorModule } from '@ngstack/code-editor';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CodeEditorDemoComponent } from './code-editor-demo/code-editor-demo.component';
import { MaterialModule } from './material.module';

const routes: Route[] = [
  {
    path: '',
    component: CodeEditorDemoComponent,
  },
];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
    }),
    MaterialModule,

    CodeEditorModule.forRoot({
      // use local Monaco installation
      baseUrl: 'assets/monaco',
      // use local Typings Worker
      typingsWorkerUrl: 'assets/workers/typings-worker.js',
    }),
  ],
  declarations: [AppComponent, CodeEditorDemoComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
