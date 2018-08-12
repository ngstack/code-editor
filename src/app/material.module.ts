import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
// import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTreeModule } from '@angular/material/tree';

@NgModule({
  imports: [
    MatButtonModule,
    // MatSelectModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatTreeModule
  ],
  exports: [
    MatButtonModule,
    // MatSelectModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatTreeModule
  ]
})
export class MaterialModule {}
