import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Route } from '@angular/router';
import { TranslateModule } from '@ngstack/translate';
import { CodeEditorModule } from '@ngstack/code-editor';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateDemoComponent } from './translate-demo/translate-demo.component';
import { CodeEditorDemoComponent } from './code-editor-demo/code-editor-demo.component';
import { CustomTranslatePipe } from './translate-demo/custom-translate.pipe';

const routes: Route[] = [
  {
    path: 'translate',
    component: TranslateDemoComponent
  },
  {
    path: 'translate-lazy',
    loadChildren:
      'src/app/translate-lazy-demo/translate-lazy-demo.module#TranslateLazyDemoModule'
  },
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
    TranslateModule.forRoot({
      activeLang: 'en'
    }),
    CodeEditorModule.forRoot({
      // use local Monaco installation
      baseUrl: 'assets/monaco',
      // use local Typings Worker
      typingsWorkerUrl: 'assets/workers/typings-worker.js'
    }),
    MatButtonModule,
    MatSelectModule
  ],
  declarations: [
    AppComponent,
    TranslateDemoComponent,
    CodeEditorDemoComponent,
    CustomTranslatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
