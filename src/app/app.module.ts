import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Route } from '@angular/router';
import { CodeEditorModule } from '@ngstack/code-editor';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CodeEditorDemoComponent } from './code-editor-demo/code-editor-demo.component';

const routes: Route[] = [
  {
    path: 'code-editor',
    component: CodeEditorDemoComponent
  }
];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes, { initialNavigation: 'enabled' }),
    CodeEditorModule.forRoot({
      // use local Monaco installation
      baseUrl: 'assets/monaco',
      // use local Typings Worker
      typingsWorkerUrl: 'assets/workers/typings-worker.js'
    }),
    MatButtonModule,
    MatSelectModule
  ],
  declarations: [AppComponent, CodeEditorDemoComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
