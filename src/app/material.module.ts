import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
// import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTreeModule } from '@angular/material/tree';
import { MatProgressBarModule } from '@angular/material/progress-bar';

export function modules() {
  return [
    MatButtonModule,
    // MatSelectModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatTreeModule,
    MatProgressBarModule
  ];
}

@NgModule({
  imports: modules(),
  exports: modules()
})
export class MaterialModule {}
