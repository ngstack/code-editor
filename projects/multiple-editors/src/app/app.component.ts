import { Component } from '@angular/core';
import { CodeEditorComponent, CodeModel } from '@ngstack/code-editor';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CodeEditorComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  file1: CodeModel = {
    language: 'text',
    value: 'left editor',
    uri: 'left.txt'
  };

  file2: CodeModel = {
    language: 'text',
    value: 'right editor',
    uri: 'right.txt'
  };
}
