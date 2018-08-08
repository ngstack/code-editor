import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  ViewEncapsulation
} from '@angular/core';
import { MatSelectChange } from '@angular/material/select';

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

  demos = [
    {
      id: 'typescript',
      language: 'typescript',
      code: `
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
      id: 'javascript',
      language: 'javascript',
      code: `
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
      id: 'json',
      language: 'json',
      code: [
        '{',
        '    "$schema": "http://myserver/foo-schema.json",',
        '    "p1": "v3",',
        '    "p2": false',
        '}'
      ].join('\n')
    }
  ];

  selectedDemo = this.demos[2];

  @Input() activeTheme = 'vs';
  @Input() code = this.demos[2].code;
  @Input() readOnly = false;
  @ViewChild('file') fileInput: ElementRef;

  options = {
    contextmenu: true,
    minimap: {
      enabled: false
    }
  };

  dependencies: string[] = [
    '@types/node',
    '@ngstack/translate',
    '@ngstack/code-editor'
  ];

  onCodeChanged(value) {
    // console.log('CODE', this.code);
  }

  onLoadClicked() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event) {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      const file = files.item(0);
      const reader = new FileReader();

      reader.onloadend = () => {
        this.code = reader.result;
      };
      reader.readAsText(file);
    }
  }

  onDemoChanged(event: MatSelectChange) {
    this.code = event.value.code;
  }
}
