# @ngstack/code-editor

Code editor component for Angular applications.

Based on the [Monaco](https://www.npmjs.com/package/monaco-editor) editor
that powers [VS Code](https://github.com/Microsoft/vscode).

## Live demos

- [Angular 6](https://stackblitz.com/edit/ngstack-code-editor-ng6)

## Installing

```sh
npm install @ngstack/code-editor
```

## Integrating with Angular CLI project

Import `CodeEditorModule` into your main application module:

```ts
import { CodeEditorModule } from '@ngstack/code-editor';

@NgModule({
  imports: [
    ...,
    CodeEditorModule.forRoot()
  ],
  ...
})
export class AppModule {}
```

Update template to use the `ngs-code-editor`:

```html
<ngs-code-editor
  theme="vs-dark"
  language="javascript"
  [(value)]="code"
  [options]="options"
  (valueChanged)="onCodeChanged($event)">
</ngs-code-editor>
```

Update component controller class and provide corresponding properties and events:

```ts
export class AppComponent {
  @Input() code = 'var x = 1;';

  options = {
    contextmenu: true,
    minimap: {
      enabled: true
    }
  };

  onCodeChanged(value) {
    console.log('CODE', this.code);
  }
}
```

## Input Properties

| Name         | Type     | Default Value | Description                                                  |
| ------------ | -------- | ------------- | ------------------------------------------------------------ |
| theme        | string   | vs            | Editor theme. Allowed values: `vs`, `vs-dark` or `hc-black`. |
| language     | string   | typescript    | Editor language.                                             |
| options      | Object   | {...}         | Editor options.                                              |
| readOnly     | boolean  | false         | Toggles readonly state of the editor.                        |
| value        | string   |               | Editor text value.                                           |
| dependencies | string[] |               | Dependencies to use.                                         |

### Editor Options

For available options see [IEditorConstructionOptions](https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditorconstructionoptions.html) docs.

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

| Name         | Argument Type | Description                             |
| ------------ | ------------- | --------------------------------------- |
| valueChanged | string        | Raised after editor value gets changed. |

## Typings

The editor is able to resolve typing libraries when set to the `Typescript` or `Javascript` language.

Use `dependencies` property to provide a list of libraries to resolve

```html
<ngs-code-editor [dependencies]="dependencies" ...>
</ngs-code-editor>
```

And in the controller class:

```ts
export class MyEditorComponent {
  dependencies: string[] = [
    '@types/node',
    '@ngstack/translate',
    '@ngstack/code-editor'
  ];
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

## Offline Setup

### Editor

You can run the editor in the offline mode with your Angular CLI application using the following steps:

Install the `monaco-editor`:

```sh
npm install monaco-editor
```

Update the `.angular-cli.json` file and append the following asset rule:

```json
{
  "glob": "**/*",
  "input": "../node_modules/monaco-editor/min",
  "output": "./assets/monaco"
}
```

Update the main application module and setup the service to use the custom `baseUrl` when application starts:

```ts
import { CodeEditorModule, CodeEditorService } from '@ngstack/code-editor';

@NgModule({
  ...,
  imports: [
    ...,
    CodeEditorModule.forRoot({
      baseUrl: 'assets/monaco'
    })
  ],
  ...
})
export class AppModule {}
```

### Typings Worker

Update the `.angular-cli.json` file and append the following asset rule:

```ts
{
  "glob": "**/*.js",
  "input": "../node_modules/@ngstack/code-editor/workers",
  "output": "./assets/workers"
}
```

Then update the `CodeEditorService` configuration at the application startup:

```ts
@NgModule({
  ...,
  imports: [
    ...,
    CodeEditorModule.forRoot({
      typingsWorkerUrl: 'assets/workers/typings-worker.js'
    })
  ],
  ...
})
export class AppModule {}
```

## Lazy Loading

To enable Lazy Loading
use `CodeEditorModule.forRoot()` in the main application,
and `CodeEditorModule.forChild()` in all lazy-loaded feature modules.

For more details please refer to [Lazy Loading Feature Modules](https://angular.io/guide/lazy-loading-ngmodules)
