import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FileNode } from './file-node';

const FILES_DATA: FileNode[] = [
  {
    filename: 'Files',
    children: [
      {
        filename: 'json',
        type: 'json',
        code: {
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
      },
      {
        filename: 'javascript',
        type: 'js',
        code: {
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
        }
      },
      {
        filename: 'typescript',
        type: 'ts',
        code: {
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
        }
      }
    ]
  },
  {
    filename: 'Applications',
    children: [
      {
        filename: 'Calendar',
        type: 'app'
      },
      {
        filename: 'Chrome',
        type: 'app'
      },
      {
        filename: 'Webstorm',
        type: 'app'
      }
    ]
  },
  {
    filename: 'Documents',
    children: [
      {
        filename: 'angular',
        children: [
          {
            filename: 'src',
            children: [
              {
                filename: 'compiler',
                type: 'ts'
              },
              {
                filename: 'core',
                type: 'ts'
              }
            ]
          }
        ]
      },
      {
        filename: 'material2',
        children: [
          {
            filename: 'src',
            children: [
              {
                filename: 'button',
                type: 'ts'
              },
              {
                filename: 'checkbox',
                type: 'ts'
              },
              {
                filename: 'input',
                type: 'ts'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    filename: 'Downloads',
    children: [
      {
        filename: 'October',
        type: 'pdf'
      },
      {
        filename: 'November',
        type: 'pdf'
      },
      {
        filename: 'Tutorial',
        type: 'html'
      }
    ]
  },
  {
    filename: 'Pictures',
    children: [
      {
        filename: 'Photo Booth Library',
        children: [
          {
            filename: 'Contents',
            type: 'dir'
          },
          {
            filename: 'Pictures',
            type: 'dir'
          }
        ]
      },
      {
        filename: 'Sun',
        type: 'png'
      },
      {
        filename: 'Woods',
        type: 'png'
      }
    ]
  }
];

@Injectable()
export class FileDatabase {
  dataChange = new BehaviorSubject<FileNode[]>([]);

  get data(): FileNode[] {
    return this.dataChange.value;
  }

  constructor() {
    this.initialize();
  }

  initialize() {
    const data = FILES_DATA;

    // Notify the change.
    this.dataChange.next(data);
  }
}
