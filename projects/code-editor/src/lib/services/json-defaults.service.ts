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
        ...defaults._diagnosticsOptions.schemas,
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

  addSchemas(
    id: string,
    definitions: Array<{ uri: string; schema: Object }> = []
  ) {
    const defaults = this.monaco.languages.json.jsonDefaults;
    const options = defaults.diagnosticsOptions;

    const schemas: { [key: string]: Object } = {};

    if (options && options.schemas && options.schemas.length > 0) {
      options.schemas.forEach(schema => {
        schemas[schema.uri] = schema;
      });
    }

    for (const { uri, schema } of definitions) {
      schemas[uri] = {
        uri,
        schema,
        fileMatch: [id || '*.json']
      };
    }

    // console.log(schemas);
    // console.log(Object.values(schemas));

    options.schemas = Object.values(schemas);
    defaults.setDiagnosticsOptions(options);
  }
}
