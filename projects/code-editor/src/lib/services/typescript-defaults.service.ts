import { Injectable } from '@angular/core';
import { CodeEditorService, TypingsInfo } from './code-editor.service';

@Injectable({
  providedIn: 'root'
})
export class TypescriptDefaultsService {
  private monaco: any;

  constructor(codeEditorService: CodeEditorService) {
    codeEditorService.loaded.subscribe(event => {
      this.setup(event.monaco);
    });
    codeEditorService.typingsLoaded.subscribe(typings => {
      this.updateTypings(typings);
    });
  }

  setup(monaco: any): void {
    if (!monaco) {
      return;
    }

    this.monaco = monaco;

    const defaults = monaco.languages.typescript.typescriptDefaults;

    defaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES6,
      module: 'commonjs',
      noEmit: true,
      noLib: true,
      emitDecoratorMetadata: true,
      experimentalDecorators: true,
      allowNonTsExtensions: true,
      declaration: true,
      lib: ['es2017', 'dom'],
      baseUrl: '.',
      paths: {}
    });

    defaults.setMaximumWorkerIdleTime(-1);
    defaults.setEagerModelSync(true);

    /*
    defaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true
    });
    */
  }

  updateTypings(typings: TypingsInfo) {
    if (typings) {
      this.addExtraLibs(typings.files);
      this.addLibraryPaths(typings.entryPoints);
    }
  }

  addExtraLibs(libs: Array<{ path: string; content: string }> = []): void {
    if (!this.monaco || !libs || libs.length === 0) {
      return;
    }

    const defaults = this.monaco.languages.typescript.typescriptDefaults;

    // undocumented API
    const registeredLibs = defaults.getExtraLibs();

    libs.forEach(lib => {
      if (!registeredLibs[lib.path]) {
        // needs performance improvements, recreates its worker each time
        // defaults.addExtraLib(lib.content, lib.path);
        // undocumented API
        defaults._extraLibs[lib.path] = lib.content;
      }
    });

    // undocumented API
    defaults._onDidChange.fire(defaults);
  }

  addLibraryPaths(paths: { [key: string]: string } = {}): void {
    if (!this.monaco) {
      return;
    }

    const defaults = this.monaco.languages.typescript.typescriptDefaults;
    const compilerOptions = defaults.getCompilerOptions();
    compilerOptions.paths = compilerOptions.paths || {};

    Object.keys(paths).forEach(key => {
      compilerOptions.paths[key] = [paths[key]];
    });
  }
}
