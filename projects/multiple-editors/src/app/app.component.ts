import { Component } from '@angular/core';
import { CodeModel } from '@ngstack/code-editor';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  file1: CodeModel = {
    language: 'text',
    value: 'left editor',
    uri: 'left.txt',
  };

  file2: CodeModel = {
    language: 'text',
    value: 'right editor',
    uri: 'right.txt',
  };
}
