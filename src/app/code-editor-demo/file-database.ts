import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FileNode, FileNodeType } from './file-node';

const FILES_DATA: FileNode[] = [
  {
    name: 'Files',
    type: FileNodeType.folder,
    children: [
      {
        name: 'json.json',
        type: FileNodeType.file,
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
        name: 'javascript.js',
        type: FileNodeType.file,
        code: {
          language: 'javascript',
          uri: 'main.js',
          dependencies: ['@types/node'],
          value: [
            '// JavaScript Example',
            `import * as fs from 'fs';`,
            '',
            'class Person {',
            '  greet() {',
            `    console.log('hello there');`,
            `    fs.mkdir('folder');`,
            '  }',
            '}'
          ].join('\n')
        }
      },
      {
        name: 'typescript.ts',
        type: FileNodeType.file,
        code: {
          language: 'typescript',
          uri: 'main.ts',
          dependencies: [
            '@types/node',
            '@ngstack/translate',
            '@ngstack/code-editor'
          ],
          value: [
            '// TypeScript Example',
            `import { TranslateModule, TranslateService } from '@ngstack/translate';`,
            `import { CodeEditorModule } from '@ngstack/code-editor';`,
            `import * as fs from 'fs';`,
            '',
            'export class MyClass {',
            '  constructor(translate: TranslateService) {',
            '    ',
            '  }',
            '}'
          ].join('\n')
        }
      }
    ]
  },
  {
    name: 'Applications',
    type: FileNodeType.folder,
    children: [
      {
        name: 'Calendar',
        type: FileNodeType.file
      },
      {
        name: 'Chrome',
        type: FileNodeType.file
      },
      {
        name: 'Webstorm',
        type: FileNodeType.file
      }
    ]
  },
  {
    name: 'Documents',
    type: FileNodeType.folder,
    children: [
      {
        name: 'angular',
        type: FileNodeType.folder,
        children: [
          {
            name: 'src',
            type: FileNodeType.folder,
            children: [
              {
                name: 'compiler.ts',
                type: FileNodeType.file
              },
              {
                name: 'core.ts',
                type: FileNodeType.file
              }
            ]
          }
        ]
      },
      {
        name: 'material2',
        type: FileNodeType.folder,
        children: [
          {
            name: 'src',
            type: FileNodeType.folder,
            children: [
              {
                name: 'button.ts',
                type: FileNodeType.file
              },
              {
                name: 'checkbox.ts',
                type: FileNodeType.file
              },
              {
                name: 'input.ts',
                type: FileNodeType.file
              }
            ]
          }
        ]
      }
    ]
  },
  {
    name: 'Downloads',
    type: FileNodeType.folder,
    children: [
      {
        name: 'October.pdf',
        type: FileNodeType.file
      },
      {
        name: 'November.pdf',
        type: FileNodeType.file
      },
      {
        name: 'Tutorial.html',
        type: FileNodeType.file
      }
    ]
  },
  {
    name: 'Pictures',
    type: FileNodeType.folder,
    children: [
      {
        name: 'Photo Booth Library',
        type: FileNodeType.folder,
        children: [
          {
            name: 'Contents',
            type: FileNodeType.folder
          },
          {
            name: 'Pictures',
            type: FileNodeType.folder
          }
        ]
      },
      {
        name: 'Sun.png',
        type: FileNodeType.file
      },
      {
        name: 'Woods.png',
        type: FileNodeType.file
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
