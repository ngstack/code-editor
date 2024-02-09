import { Injectable, InjectionToken, Optional, Inject } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { CodeEditorSettings } from '../editor-settings';
import { editor } from 'monaco-editor';

export const EDITOR_SETTINGS = new InjectionToken<CodeEditorSettings>(
  'EDITOR_SETTINGS'
);

export interface TypingsInfo {
  entryPoints: { [key: string]: string };
  files: Array<{
    content: string;
    name: string;
    url: string;
    path: string;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class CodeEditorService {
  readonly baseUrl: string;
  readonly typingsWorkerUrl: string;

  typingsLoaded = new Subject<TypingsInfo>();
  loaded = new BehaviorSubject<{ monaco: any } | null>(null);

  loadingTypings = new BehaviorSubject<boolean>(false);

  private typingsWorker: Worker;

  private _monaco: any;

  /**
   * Returns the global `monaco` instance
   */
  get monaco(): any {
    return this._monaco;
  }

  constructor(
    @Optional()
    @Inject(EDITOR_SETTINGS)
    settings: CodeEditorSettings
  ) {
    const editorVersion = settings?.editorVersion || 'latest';

    this.baseUrl =
      settings?.baseUrl ||
      `https://cdn.jsdelivr.net/npm/monaco-editor@${editorVersion}/min`;
    this.typingsWorkerUrl = settings?.typingsWorkerUrl || ``;
  }

  private loadTypingsWorker(): Worker {
    if (!this.typingsWorker && (<any>window).Worker) {
      if (this.typingsWorkerUrl.startsWith('http')) {
        const proxyScript = `importScripts('${this.typingsWorkerUrl}');`;
        const proxy = URL.createObjectURL(
          new Blob([proxyScript], { type: 'text/javascript' })
        );
        this.typingsWorker = new Worker(proxy);
      } else {
        this.typingsWorker = new Worker(this.typingsWorkerUrl);
      }
      this.typingsWorker.addEventListener('message', (e) => {
        this.loadingTypings.next(false);
        this.typingsLoaded.next(e.data);
      });
    }
    return this.typingsWorker;
  }

  loadTypings(dependencies: string[]) {
    if (dependencies && dependencies.length > 0) {
      const worker = this.loadTypingsWorker();
      if (worker) {
        this.loadingTypings.next(true);
        worker.postMessage({
          dependencies
        });
      }
    }
  }

  loadEditor(): Promise<void> {
    return new Promise((resolve) => {
      const onGotAmdLoader = () => {
        (<any>window).require.config({
          paths: { vs: `${this.baseUrl}/vs` }
        });

        if (this.baseUrl.startsWith('http')) {
          const proxyScript = `
            self.MonacoEnvironment = {
              baseUrl: "${this.baseUrl}"
            };
            importScripts('${this.baseUrl}/vs/base/worker/workerMain.js');
          `;
          const proxy = URL.createObjectURL(
            new Blob([proxyScript], { type: 'text/javascript' })
          );
          window['MonacoEnvironment'] = {
            getWorkerUrl: function () {
              return proxy;
            }
          };
        }

        (<any>window).require(['vs/editor/editor.main'], () => {
          this._monaco = window['monaco'];
          this.loaded.next({ monaco: this._monaco });
          resolve();
        });
      };

      if (!(<any>window).require) {
        const loaderScript = document.createElement('script');
        loaderScript.type = 'text/javascript';
        loaderScript.src = `${this.baseUrl}/vs/loader.js`;
        loaderScript.addEventListener('load', onGotAmdLoader);
        document.body.appendChild(loaderScript);
      } else {
        onGotAmdLoader();
      }
    });
  }

  /**
   * Switches to a theme.
   * @param themeName name of the theme
   */
  setTheme(themeName: string) {
    this.monaco.editor.setTheme(themeName);
  }

  createEditor(
    containerElement: HTMLElement,
    options?: editor.IEditorConstructionOptions
  ): editor.IEditor {
    return this.monaco.editor.create(containerElement, options);
  }

  createModel(
    value: string,
    language?: string,
    uri?: string
  ): editor.ITextModel {
    return this.monaco.editor.createModel(
      value,
      language,
      this.monaco.Uri.file(uri)
    );
  }

  setModelLanguage(
    model: editor.ITextModel,
    mimeTypeOrLanguageId: string
  ): void {
    if (this.monaco && model) {
      this.monaco.editor.setModelLanguage(model, mimeTypeOrLanguageId);
    }
  }
}
