import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  ViewEncapsulation
} from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { CodeModel } from '@ngstack/code-editor';

@Component({
  selector: 'app-code-editor-demo',
  templateUrl: './code-editor-demo.component.html',
  styleUrls: ['./code-editor-demo.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CodeEditorDemoComponent {
  themes = [
    { name: 'Visual Studio', value: 'vs' },
    { name: 'Visual Studio Dark', value: 'vs-dark' },
    { name: 'High Contrast Dark', value: 'hc-black' }
  ];

  demos: Array<CodeModel> = [
    {
      language: 'typescript',
      uri: 'main.ts',
      dependencies: ['@ngstack/translate', '@ngstack/code-editor'],
      value: `
        // TypeScript Example
        import { TranslateModule, TranslateService } from '@ngstack/translate';
        import { CodeEditorModule } from '@ngstack/code-editor';
        import * as fs from 'fs';

        export class MyClass {
          constructor(translate: TranslateService) {

          }
        }
      `
    },
    {
      language: 'javascript',
      uri: 'main.js',
      dependencies: ['@types/node'],
      value: `
        // JavaScript Example
        import * as fs from 'fs';

        class Person {
          greet() {
            console.log('hello there');
            fs.mkdir('folder');
          }
        }
      `
    },
    {
      language: 'json',
      uri: 'main.json',
      value: [
        '{',
        '    "$schema": "http://myserver/foo-schema.json",',
        '    "p1": "v3",',
        '    "p2": false',
        '}'
      ].join('\n')
    }
  ];

  selectedModel = this.demos[2];
  activeTheme = 'vs';
  code = this.demos[2].value;
  readOnly = false;

  @ViewChild('file')
  fileInput: ElementRef;

  options = {
    contextmenu: true,
    minimap: {
      enabled: false
    }
  };

  onCodeChanged(value) {
    // console.log('CODE', value);
  }

  onLoadClicked() {
    this.fileInput.nativeElement.click();
  }

  // onFileSelected(event) {
  //   const files: FileList = event.target.files;
  //   if (files && files.length > 0) {
  //     const file = files.item(0);
  //     const reader = new FileReader();

  //     reader.onloadend = () => {
  //       this.code = reader.result;
  //     };
  //     reader.readAsText(file);
  //   }
  // }

  onDemoChanged(event: MatSelectChange) {
    const model: CodeModel = event.value;
    this.code = model.value;
  }
}
