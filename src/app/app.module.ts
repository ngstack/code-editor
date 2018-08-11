import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Route } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CodeEditorModule } from '@ngstack/code-editor';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTreeModule } from '@angular/material/tree';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CodeEditorDemoComponent } from './code-editor-demo/code-editor-demo.component';

const routes: Route[] = [
  {
    path: '',
    component: CodeEditorDemoComponent
  }
];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes, { initialNavigation: 'enabled' }),
    FlexLayoutModule,
    MatButtonModule,
    MatSelectModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatTreeModule,

    CodeEditorModule.forRoot({
      // use local Monaco installation
      baseUrl: 'assets/monaco',
      // use local Typings Worker
      typingsWorkerUrl: 'assets/workers/typings-worker.js'
    })
  ],
  declarations: [AppComponent, CodeEditorDemoComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
