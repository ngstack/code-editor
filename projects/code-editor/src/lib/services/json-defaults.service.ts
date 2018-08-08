import { Injectable } from '@angular/core';
import { CodeEditorService } from './code-editor.service';

@Injectable({
  providedIn: 'root'
})
export class JsonDefaultsService {
  private monaco: any;

  constructor(codeEditorService: CodeEditorService) {
    codeEditorService.loaded.subscribe(event => {
      this.setup(event.monaco);
    });
  }

  setup(monaco: any): void {
    if (!monaco) {
      return;
    }

    this.monaco = monaco;

    const defaults = monaco.languages.json.jsonDefaults;

    defaults.setDiagnosticsOptions({
      validate: true,
      allowComments: true,
      schemas: [
        ...defaults._diagnosticsOptions,
        {
          uri: 'http://myserver/foo-schema.json',
          // fileMatch: [id],
          // fileMatch: ['*.json'],
          schema: {
            type: 'object',
            properties: {
              p1: {
                enum: ['v1', 'v2']
              },
              p2: {
                $ref: 'http://myserver/bar-schema.json'
              }
            }
          }
        },
        {
          uri: 'http://myserver/bar-schema.json',
          // fileMatch: [id],
          // fileMatch: ['*.json'],
          schema: {
            type: 'object',
            properties: {
              q1: {
                enum: ['x1', 'x2']
              }
            }
          }
        }
      ]
    });
  }
}
