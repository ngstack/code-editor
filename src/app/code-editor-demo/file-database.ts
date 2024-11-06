import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FileNode, FileNodeType } from './file-node';

const FILES_DATA: FileNode[] = [
  {
    name: 'Files',
    type: FileNodeType.folder,
    children: [
      {
        name: 'schema.sql',
        type: FileNodeType.file,
        code: {
          language: 'sql',
          uri: 'schema.sql',
          value: [
            'CREATE TABLE dbo.EmployeePhoto (',
            '  EmployeeId INT NOT NULL PRIMARY KEY,',
            '  Photo VARBINARY(MAX) FILESTREAM NULL,',
            '  MyRowGuidColumn UNIQUEIDENTIFIER NOT NULL ROWGUIDCOL UNIQUE DEFAULT NEWID()',
            ');'
          ].join('\n')
        }
      },
      {
        name: 'component.style.css',
        type: FileNodeType.file,
        code: {
          language: 'css',
          uri: 'component.style.css',
          value: [
            'html {',
            '  background-color: #e2e2e2;',
            '  margin: 0;',
            '  padding: 0;',
            '}',
            '',
            'body {',
            '  background-color: #fff;',
            '  border-top: solid 10px #000;',
            '  color: #333;',
            '  font-size: .85em;',
            '  font-family: "Segoe UI","HelveticaNeue-Light", sans-serif;',
            '  margin: 0;',
            '  padding: 0;',
            '}'
          ].join('\n')
        }
      },
      {
        name: 'json.json',
        type: FileNodeType.file,
        code: {
          language: 'json',
          uri: 'main.json',
          value: [
            '{',
            '  "$schema": "http://custom/schema.json",',
            '      "type": "button"',
            '}'
          ].join('\n'),
          schemas: [
            {
              uri: 'http://custom/schema.json',
              schema: {
                type: 'object',
                properties: {
                  type: {
                    enum: ['button', 'textbox']
                  }
                }
              }
            }
          ]
        }
      },
      {
        name: 'javascript.js',
        type: FileNodeType.file,
        code: {
          language: 'javascript',
          uri: 'main.js',
          dependencies: [/*'@types/node'*/],
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
            // '@types/node',
            // '@ngstack/translate',
            // '@ngstack/code-editor'
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
    // Notify the change.
    this.dataChange.next(FILES_DATA);
  }
}
