import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DemoPageComponent } from './demo-page/demo-page.component';
import { TranslateModule } from '@ngstack/translate';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: DemoPageComponent }
    ]),
    TranslateModule
  ],
  declarations: [DemoPageComponent]
})
export class TranslateLazyDemoModule {}
