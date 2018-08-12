import {
  Component,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
  OnInit
} from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { CodeModel } from '@ngstack/code-editor';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { FileNode } from './file-node';
import { FileDatabase } from './file-database';

@Component({
  selector: 'app-code-editor-demo',
  templateUrl: './code-editor-demo.component.html',
  styleUrls: ['./code-editor-demo.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [FileDatabase]
})
export class CodeEditorDemoComponent implements OnInit {
  nestedTreeControl: NestedTreeControl<FileNode>;
  nestedDataSource: MatTreeNestedDataSource<FileNode>;

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

  constructor(database: FileDatabase) {
    this.nestedTreeControl = new NestedTreeControl<FileNode>(this._getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();

    database.dataChange.subscribe(data => (this.nestedDataSource.data = data));
  }

  hasNestedChild = (_: number, nodeData: FileNode) => !nodeData.type;

  private _getChildren = (node: FileNode) => node.children;

  onCodeChanged(value) {
    // console.log('CODE', value);
  }

  onLoadClicked() {
    this.fileInput.nativeElement.click();
  }

  onDemoChanged(event: MatSelectChange) {
    const model: CodeModel = event.value;
    this.code = model.value;
  }

  ngOnInit() {}
}
