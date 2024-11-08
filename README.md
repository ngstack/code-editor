# @ngstack/code-editor

Code editor component for Angular applications.

Based on the [Monaco](https://www.npmjs.com/package/monaco-editor) editor
that powers [VS Code](https://github.com/Microsoft/vscode).

<a href="https://www.buymeacoffee.com/denys" target="_blank">
  <img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="51" width="217">
</a>

## Installing

```sh
npm install @ngstack/code-editor
```

## Integrating with Standalone Angular Project

Update the `app.config.ts` file to provide the code editor configuration:

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    
    // Configure Code Editor
    provideCodeEditor({
      // editorVersion: '0.46.0',
      // use local Monaco installation
      baseUrl: 'assets/monaco',
      // use local Typings Worker
      typingsWorkerUrl: 'assets/workers/typings-worker.js'
    })
  ]
};
```

## Integrating with Modules-based Angular Project

Import `CodeEditorModule` into your main application module:

```ts
import { provideCodeEditor } from '@ngstack/code-editor';

@NgModule({
  providers: [provideCodeEditor()]
})
export class AppModule {}
```

If you want to use a specific version of the Monaco editor, use `editorVersion` parameter.
If not provided, the component is always going to use the `latest` version.

> For a full list of Monaco versions and changes, please refer to the official [CHANGELOG.md](https://github.com/microsoft/monaco-editor/blob/main/CHANGELOG.md) file

```ts
import { provideCodeEditor } from '@ngstack/code-editor';

@NgModule({
  providers: [
    provideCodeEditor({
      editorVersion: '0.44.0'
    })
  ]
})
export class AppModule {}
```

Update template to use the `ngs-code-editor`:

```html
<ngs-code-editor [theme]="theme" [codeModel]="model" [options]="options" (valueChanged)="onCodeChanged($event)"></ngs-code-editor>
```

Update component controller class and provide corresponding properties and events:

```ts
export class AppComponent {
  theme = 'vs-dark';

  model: CodeModel = {
    language: 'json',
    uri: 'main.json',
    value: '{}'
  };

  options = {
    contextmenu: true,
    minimap: {
      enabled: true
    }
  };

  onCodeChanged(value) {
    console.log('CODE', value);
  }
}
```

## Input Properties

| Name      | Type      | Default Value | Description                                                    |
|-----------|-----------|---------------|----------------------------------------------------------------|
| theme     | string    | vs            | Editor theme. Supported values: `vs`, `vs-dark` or `hc-black`. |
| options   | Object    | {...}         | Editor options.                                                |
| readOnly  | boolean   | false         | Toggles readonly state of the editor.                          |
| codeModel | CodeModel |               | Source code model.                                             |

The `codeModel` property holds the value that implements the `CodeModel` interface:

```ts
export interface CodeModel {
  language: string;
  value: string;
  uri: string;

  dependencies?: Array<string>;
  schemas?: Array<{
    uri: string;
    schema: Object;
  }>;
}
```

### Editor Options

For available options see [IEditorConstructionOptions](https://microsoft.github.io/monaco-editor/typedoc/interfaces/editor.IEditorConstructionOptions.html) docs.

The following options are used by default when Editor Component gets created:

```json
{
  "lineNumbers": true,
  "contextmenu": false,
  "minimap": {
    "enabled": false
  }
}
```

## Output Events

| Name                | Argument Type               | Description                                                                    |
|---------------------|-----------------------------|--------------------------------------------------------------------------------|
| loaded              |                             | Raised when editor finished loading all its components.                        |
| valueChanged        | string                      | An event emitted when the text content of the model have changed.              |
| modelContentChanged | `IModelContentChangedEvent` | An event emitted when the contents of the underlying editor model have changed |
| codeModelChanged    | `CodeModelChangedEvent`     | An event emitted when the code model value is changed.                         |

## Component API

| Name                | Description                                                                                                                                         |
|---------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| editor              | returns the instance of the underlying Monaco [ICodeEditor](https://microsoft.github.io/monaco-editor/docs.html#interfaces/editor.ICodeEditor.html) |
| runAction(id, args) | runs the editor actions, for example `editor.action.formatDocument`                                                                                 |
| formatDocument()    | shortcut function to format the document                                                                                                            |

## Editor Service

The component comes with a separate `CodeEditorService` service that provides additional APIs for the underlying `monaco` editor:

| Name                | Description                                           |
|---------------------|-------------------------------------------------------|
| monaco              | get the global monaco instance                        |
| typingsLoaded       | An event emitted when code typings are loaded         |
| loaded              | An event emitted when the `monaco` instance is loaded |
| setTheme(themeName) | Switches to a theme                                   |

## Typings

The editor is able to resolve typing libraries when set to the `Typescript` or `Javascript` language.

Use `dependencies` property to provide a list of libraries to resolve

```html
<ngs-code-editor [codeModel]="model"> </ngs-code-editor>
```

And in the controller class:

```ts
export class MyEditorComponent {
  codeModel: CodeModel = {
    language: 'typescript',
    uri: 'main.ts',
    value: '',
    dependencies: ['@types/node', '@ngstack/translate', '@ngstack/code-editor']
  };
}
```

Run your application, it may take a few seconds to resolve dependencies.
It is performed in the background (web worker), so you can type your code.

Try pasting the following snippet at runtime:

```typescript
import { TranslateModule, TranslateService } from '@ngstack/translate';
import { CodeEditorModule } from '@ngstack/code-editor';
import * as fs from 'fs';

export class MyClass {
  constructor(translate: TranslateService) {}
}
```

You should have all the types resolved and auto-completion working.

## JSON schemas

You can associate multiple schemas when working with JSON files.

```html
<ngs-code-editor [codeModel]="model"></ngs-code-editor>
```

Provide the required schemas like in the example below.

```ts
export class MyEditorComponent {
  codeModel: CodeModel = {
    language: 'json',
    uri: 'main.json',
    value: '{ "test": true }',
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
  };
}
```

The schemas get automatically installed and associated with the corresponding file.

## Accessing Code Editor Instance

You can access the Code Editor component instance API from other components when using with the `@ViewChild`:

```ts
class MyComponent {
  private _codeEditor: CodeEditorComponent;

  @ViewChild(CodeEditorComponent, { static: false })
  set codeEditor(value: CodeEditorComponent) {
    this._codeEditor = value;
  }

  get codeEditor(): CodeEditorComponent {
    return this._codeEditor;
  }
}
```

The code above allows you to use the code editor within the `*ngIf`, for example:

```html
<ng-container *ngIf="selectedModel">
  <ngs-code-editor [codeModel]="selectedModel"></ngs-code-editor>
</ng-container>
```

Other components can now have access to the editor instance:

```html
<button mat-icon-button title="Format code" (click)="codeEditor?.formatDocument()">
  <mat-icon>format_align_left</mat-icon>
</button>
```

### Example: auto-formatting on load

```html
<ngs-code-editor [codeModel]="selectedModel" [options]="options" (codeModelChanged)="onCodeModelChanged($event)"></ngs-code-editor>
```

```ts
import { CodeModelChangedEvent } from '@ngstack/code-editor';

class MyComponent {
  onCodeModelChanged(event: CodeModelChangedEvent) {
    setTimeout(() => {
      event.sender.formatDocument();
    }, 100);
  }
}
```

## Offline Setup

### Editor

You can run the editor in the offline mode with your Angular CLI application using the following steps:

Install the `monaco-editor`:

```sh
npm install monaco-editor
```

Update the `angular.json` file and append the following asset rule:

```json
{
  "glob": "**/*",
  "input": "../node_modules/monaco-editor/min",
  "output": "./assets/monaco"
}
```

Update the main application module and setup the service to use the custom `baseUrl` when application starts:

```ts
import { provideCodeEditor } from '@ngstack/code-editor';

@NgModule({
  providers: [
    provideCodeEditor({
      baseUrl: 'assets/monaco'
    })
  ]
})
export class AppModule {}
```

### Typings Worker

Update the `angular.json` file and append the following asset rule:

```json
{
  "glob": "**/*.js",
  "input": "../node_modules/@ngstack/code-editor/workers",
  "output": "./assets/workers"
}
```

Then update the `CodeEditorService` configuration at the application startup:

```ts
import { provideCodeEditor } from '@ngstack/code-editor';

@NgModule({
  providers: [
    provideCodeEditor({
      typingsWorkerUrl: 'assets/workers/typings-worker.js'
    })
  ]
})
export class AppModule {}
```

## Lazy Loading

To enable Lazy Loading
use `CodeEditorModule.forRoot()` in the main application,
and `CodeEditorModule` in all lazy-loaded feature modules.

For more details please refer to [Lazy Loading Feature Modules](https://angular.io/guide/lazy-loading-ngmodules)
